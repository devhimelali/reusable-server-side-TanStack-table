import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DataTableColumnHeaderProps = {
    title: string;
    className?: string;
    column: {
        getCanSort: () => boolean;
        getIsSorted: () => false | 'asc' | 'desc';
        getToggleSortingHandler: () => undefined | ((event: unknown) => void);
    };
};

export function DataTableColumnHeader({
    title,
    column,
    className,
}: DataTableColumnHeaderProps) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    const sorted = column.getIsSorted();

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn('-ml-3 h-8', className)}
            onClick={column.getToggleSortingHandler()}
        >
            {title}
            {sorted === 'desc' ? (
                <ArrowDown />
            ) : sorted === 'asc' ? (
                <ArrowUp />
            ) : (
                <ArrowUpDown />
            )}
        </Button>
    );
}
