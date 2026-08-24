import { MoreHorizontal } from 'lucide-react';
import {
    createAppColumnHelper,
    DataTableColumnHeader,
} from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Product, ProductStatus } from '@/pages/products/types';

const columnHelper = createAppColumnHelper<Product>();

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const statusVariants: Record<
    ProductStatus,
    'default' | 'secondary' | 'outline'
> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
};

export const columns = columnHelper.columns([
    columnHelper.display({
        id: 'select',
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    }),
    columnHelper.accessor('name', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    }),
    columnHelper.accessor('sku', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SKU" />
        ),
    }),
    columnHelper.accessor('category', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
    }),
    columnHelper.accessor('status', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ getValue }) => {
            const status = getValue();

            return (
                <Badge variant={statusVariants[status]} className="capitalize">
                    {status}
                </Badge>
            );
        },
    }),
    columnHelper.accessor('price', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ getValue }) => currency.format(Number(getValue())),
    }),
    columnHelper.accessor('stock', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Stock" />
        ),
    }),
    columnHelper.accessor('created_at', {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ getValue }) =>
            new Date(getValue()).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
    }),
    columnHelper.display({
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: () => (
            <Button variant="ghost" size="icon" aria-label="Actions">
                <MoreHorizontal />
            </Button>
        ),
    }),
]);
