import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import type { useAppTable } from '@/components/data-table/table';
import type {
    DataTablePaginationVariant,
    Paginator,
} from '@/components/data-table/types';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

type DataTablePaginationProps<TData extends { id: number | string }> = {
    table: ReturnType<typeof useAppTable<TData>>;
    paginator: Paginator<TData>;
    variant?: DataTablePaginationVariant;
};

function getPageItems(
    current: number,
    last: number,
): Array<number | 'ellipsis'> {
    if (last <= 1) {
        return last === 1 ? [1] : [];
    }

    if (last <= 7) {
        return Array.from({ length: last }, (_, index) => index + 1);
    }

    const items: Array<number | 'ellipsis'> = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    if (start > 2) {
        items.push('ellipsis');
    }

    for (let page = start; page <= end; page++) {
        items.push(page);
    }

    if (end < last - 1) {
        items.push('ellipsis');
    }

    items.push(last);

    return items;
}

function RangeText<TData>({ paginator }: { paginator: Paginator<TData> }) {
    return (
        <p className="text-sm text-muted-foreground">
            {paginator.from && paginator.to
                ? `Showing ${paginator.from} to ${paginator.to} of ${paginator.total}`
                : `Showing 0 of ${paginator.total}`}
        </p>
    );
}

function PerPageSelect<TData extends { id: number | string }>({
    table,
    paginator,
}: {
    table: ReturnType<typeof useAppTable<TData>>;
    paginator: Paginator<TData>;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Per page</span>
            <Select
                value={String(paginator.per_page)}
                onValueChange={(value) => table.setPageSize(Number(value))}
            >
                <SelectTrigger size="sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function PrevNextButtons<TData extends { id: number | string }>({
    table,
    paginator,
    showPageLabel = false,
}: {
    table: ReturnType<typeof useAppTable<TData>>;
    paginator: Paginator<TData>;
    showPageLabel?: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Previous page"
            >
                <ChevronLeft />
            </Button>
            {showPageLabel && (
                <span className="text-sm whitespace-nowrap">
                    Page {paginator.current_page} of {paginator.last_page || 1}
                </span>
            )}
            <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Next page"
            >
                <ChevronRight />
            </Button>
        </div>
    );
}

function PageNumbers<TData extends { id: number | string }>({
    table,
    paginator,
}: {
    table: ReturnType<typeof useAppTable<TData>>;
    paginator: Paginator<TData>;
}) {
    const items = getPageItems(paginator.current_page, paginator.last_page);

    return (
        <div className="flex items-center gap-1">
            {items.map((item, index) =>
                item === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-sm text-muted-foreground"
                    >
                        ...
                    </span>
                ) : (
                    <Button
                        key={item}
                        variant={
                            item === paginator.current_page
                                ? 'default'
                                : 'outline'
                        }
                        size="icon"
                        onClick={() => table.setPageIndex(item - 1)}
                        disabled={item === paginator.current_page}
                        aria-label={`Page ${item}`}
                        aria-current={
                            item === paginator.current_page ? 'page' : undefined
                        }
                    >
                        {item}
                    </Button>
                ),
            )}
        </div>
    );
}

function SimplePagination<TData extends { id: number | string }>({
    table,
    paginator,
}: Omit<DataTablePaginationProps<TData>, 'variant'>) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <RangeText paginator={paginator} />
            <div className="flex items-center gap-4">
                <PerPageSelect table={table} paginator={paginator} />
                <PrevNextButtons
                    table={table}
                    paginator={paginator}
                    showPageLabel
                />
            </div>
        </div>
    );
}

function CompactPagination<TData extends { id: number | string }>({
    table,
    paginator,
}: Omit<DataTablePaginationProps<TData>, 'variant'>) {
    return (
        <div className="flex items-center justify-end">
            <PrevNextButtons
                table={table}
                paginator={paginator}
                showPageLabel
            />
        </div>
    );
}

function NumberedPagination<TData extends { id: number | string }>({
    table,
    paginator,
}: Omit<DataTablePaginationProps<TData>, 'variant'>) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <RangeText paginator={paginator} />
            <div className="flex flex-wrap items-center gap-4">
                <PerPageSelect table={table} paginator={paginator} />
                <PrevNextButtons table={table} paginator={paginator} />
                <PageNumbers table={table} paginator={paginator} />
            </div>
        </div>
    );
}

function FullPagination<TData extends { id: number | string }>({
    table,
    paginator,
}: Omit<DataTablePaginationProps<TData>, 'variant'>) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <RangeText paginator={paginator} />
            <div className="flex flex-wrap items-center gap-4">
                <PerPageSelect table={table} paginator={paginator} />
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="First page"
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                    >
                        <ChevronLeft />
                    </Button>
                    <PageNumbers table={table} paginator={paginator} />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Last page"
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function DataTablePagination<TData extends { id: number | string }>({
    table,
    paginator,
    variant = 'simple',
}: DataTablePaginationProps<TData>) {
    if (variant === 'compact') {
        return <CompactPagination table={table} paginator={paginator} />;
    }

    if (variant === 'numbered') {
        return <NumberedPagination table={table} paginator={paginator} />;
    }

    if (variant === 'full') {
        return <FullPagination table={table} paginator={paginator} />;
    }

    return <SimplePagination table={table} paginator={paginator} />;
}
