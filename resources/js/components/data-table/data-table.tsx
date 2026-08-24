import { DataTablePagination } from '@/components/data-table/pagination';
import { DataTableToolbar } from '@/components/data-table/toolbar';
import type {
    DataTableFilterField,
    DataTableQueryState,
    DataTableUrl,
    Paginator,
} from '@/components/data-table/types';
import { useServerTable } from '@/components/data-table/use-server-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DataTableProps<TData extends { id: number | string }> = {
    columns: Parameters<typeof useServerTable<TData>>[0]['columns'];
    paginator: Paginator<TData>;
    query: DataTableQueryState;
    url: DataTableUrl;
    filterFields?: DataTableFilterField[];
    reload?: string[];
};

export function DataTable<TData extends { id: number | string }>({
    columns,
    paginator,
    query,
    url,
    filterFields,
    reload,
}: DataTableProps<TData>) {
    const {
        table,
        search,
        setSearch,
        setFilter,
        reset,
        isLoading,
        hasActiveFilters,
    } = useServerTable({
        columns,
        paginator,
        query,
        url,
        reload,
    });

    const columnCount = table.getVisibleLeafColumns().length;
    const rows = table.getRowModel().rows;
    const skeletonRows = paginator.data.length || query.per_page;

    return (
        <div className="flex flex-col gap-4">
            <DataTableToolbar
                table={table}
                search={search}
                onSearchChange={setSearch}
                filterFields={filterFields}
                filters={query.filters}
                onFilterChange={setFilter}
                hasActiveFilters={hasActiveFilters}
                onReset={reset}
            />

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: skeletonRows }).map(
                                (_, rowIndex) => (
                                    <TableRow key={`skeleton-${rowIndex}`}>
                                        {Array.from({
                                            length: columnCount,
                                        }).map((__, cellIndex) => (
                                            <TableCell
                                                key={`skeleton-${rowIndex}-${cellIndex}`}
                                            >
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ),
                            )
                        ) : rows.length > 0 ? (
                            rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected()
                                            ? 'selected'
                                            : undefined
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnCount}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} paginator={paginator} />
        </div>
    );
}
