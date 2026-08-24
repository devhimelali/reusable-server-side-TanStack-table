import { router } from '@inertiajs/react';
import type {
    PaginationState,
    SortingState,
    Updater,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppTable } from '@/components/data-table/table';
import type {
    DataTableQueryState,
    DataTableUrl,
    Paginator,
} from '@/components/data-table/types';
import type { QueryParams } from '@/wayfinder';

const PER_PAGE_DEFAULT = 10;

function applyUpdater<T>(updater: Updater<T>, previous: T): T {
    return typeof updater === 'function'
        ? (updater as (old: T) => T)(previous)
        : updater;
}

export function toQueryParams(state: DataTableQueryState): QueryParams {
    const params: QueryParams = {};

    if (state.page > 1) {
        params.page = state.page;
    }

    if (state.per_page !== PER_PAGE_DEFAULT) {
        params.per_page = state.per_page;
    }

    if (state.search) {
        params.search = state.search;
    }

    if (state.sort) {
        params.sort = state.sort;
        params.direction = state.direction ?? 'desc';
    }

    if (Object.keys(state.filters).length > 0) {
        params.filters = state.filters;
    }

    return params;
}

type UseServerTableOptions<TData extends { id: number | string }> = {
    columns: Parameters<typeof useAppTable<TData>>[0]['columns'];
    paginator: Paginator<TData>;
    query: DataTableQueryState;
    url: DataTableUrl;
    reload?: string[];
};

export function useServerTable<TData extends { id: number | string }>({
    columns,
    paginator,
    query,
    url,
    reload,
}: UseServerTableOptions<TData>) {
    const [search, setSearch] = useState(query.search ?? '');
    const [isLoading, setIsLoading] = useState(false);

    const visit = useCallback(
        (patch: Partial<DataTableQueryState>) => {
            const next: DataTableQueryState = {
                search:
                    patch.search !== undefined ? patch.search : query.search,
                sort: patch.sort !== undefined ? patch.sort : query.sort,
                direction:
                    patch.direction !== undefined
                        ? patch.direction
                        : query.direction,
                per_page: patch.per_page ?? query.per_page,
                page: patch.page ?? query.page,
                filters:
                    patch.filters !== undefined ? patch.filters : query.filters,
            };

            router.get(
                url(toQueryParams(next)),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    ...(reload && reload.length > 0 ? { only: reload } : {}),
                    onStart: () => setIsLoading(true),
                    onFinish: () => setIsLoading(false),
                },
            );
        },
        [query, reload, url],
    );

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            const nextSearch = search.trim() === '' ? null : search.trim();

            if (nextSearch === (query.search ?? null)) {
                return;
            }

            visit({ search: nextSearch, page: 1 });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [query.search, search, visit]);

    const pagination = useMemo<PaginationState>(
        () => ({
            pageIndex: Math.max(query.page - 1, 0),
            pageSize: query.per_page,
        }),
        [query.page, query.per_page],
    );

    const sorting = useMemo<SortingState>(
        () =>
            query.sort
                ? [{ id: query.sort, desc: query.direction !== 'asc' }]
                : [],
        [query.direction, query.sort],
    );

    const table = useAppTable({
        data: paginator.data,
        columns,
        rowCount: paginator.total,
        state: {
            pagination,
            sorting,
            globalFilter: query.search ?? '',
        },
        onPaginationChange: (updater) => {
            const next = applyUpdater(updater, pagination);

            visit({
                page:
                    next.pageSize !== pagination.pageSize
                        ? 1
                        : next.pageIndex + 1,
                per_page: next.pageSize,
            });
        },
        onSortingChange: (updater) => {
            const next = applyUpdater(updater, sorting);
            const sort = next[0];

            visit({
                sort: sort?.id ?? null,
                direction: sort ? (sort.desc ? 'desc' : 'asc') : null,
                page: 1,
            });
        },
    });

    const setFilter = useCallback(
        (id: string, value: string) => {
            const filters = { ...query.filters };

            if (value === '') {
                delete filters[id];
            } else {
                filters[id] = value;
            }

            visit({ filters, page: 1 });
        },
        [query.filters, visit],
    );

    const reset = useCallback(() => {
        visit({
            search: null,
            sort: null,
            direction: null,
            filters: {},
            page: 1,
        });
        setSearch('');
    }, [visit]);

    const hasActiveFilters =
        Boolean(query.search) ||
        Boolean(query.sort) ||
        Object.keys(query.filters).length > 0;

    return {
        table,
        search,
        setSearch,
        setFilter,
        reset,
        isLoading,
        hasActiveFilters,
        query,
        paginator,
    };
}
