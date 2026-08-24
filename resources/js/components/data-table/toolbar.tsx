import { Search, X } from 'lucide-react';
import type { useAppTable } from '@/components/data-table/table';
import type { DataTableFilterField } from '@/components/data-table/types';
import { DataTableViewOptions } from '@/components/data-table/view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type DataTableToolbarProps<TData extends { id: number | string }> = {
    table: ReturnType<typeof useAppTable<TData>>;
    search: string;
    onSearchChange: (value: string) => void;
    filterFields?: DataTableFilterField[];
    filters: Record<string, string>;
    onFilterChange: (id: string, value: string) => void;
    hasActiveFilters: boolean;
    onReset: () => void;
};

export function DataTableToolbar<TData extends { id: number | string }>({
    table,
    search,
    onSearchChange,
    filterFields = [],
    filters,
    onFilterChange,
    hasActiveFilters,
    onReset,
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search..."
                    className="pl-8"
                />
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-2">
                {filterFields.map((field) => (
                    <Select
                        key={field.id}
                        value={filters[field.id] ?? 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                field.id,
                                value === 'all' ? '' : value,
                            )
                        }
                    >
                        <SelectTrigger size="sm">
                            <SelectValue placeholder={field.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All {field.label.toLowerCase()}
                            </SelectItem>
                            {field.options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onReset}>
                        Reset
                        <X />
                    </Button>
                )}
            </div>

            <DataTableViewOptions table={table} />
        </div>
    );
}
