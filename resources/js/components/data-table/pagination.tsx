import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { useAppTable } from '@/components/data-table/table';
import type { Paginator } from '@/components/data-table/types';
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
};

export function DataTablePagination<TData extends { id: number | string }>({
    table,
    paginator,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                {paginator.from && paginator.to
                    ? `Showing ${paginator.from} to ${paginator.to} of ${paginator.total}`
                    : `Showing 0 of ${paginator.total}`}
            </p>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">Per page</span>
                    <Select
                        value={String(paginator.per_page)}
                        onValueChange={(value) =>
                            table.setPageSize(Number(value))
                        }
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
                    <span className="text-sm whitespace-nowrap">
                        Page {paginator.current_page} of {paginator.last_page}
                    </span>
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
            </div>
        </div>
    );
}
