import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import type { DataTableQueryState, Paginator } from '@/components/data-table';
import type { DataTableFilterOption } from '@/components/data-table/types';
import Heading from '@/components/heading';
import { columns } from '@/pages/products/columns';
import type { Product } from '@/pages/products/types';
import { index } from '@/routes/products';

const reload = ['products', 'query'];

export default function ProductsIndex({
    products,
    query,
    categories,
    statuses,
}: {
    products: Paginator<Product>;
    query: DataTableQueryState;
    categories: string[];
    statuses: DataTableFilterOption[];
}) {
    return (
        <>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Products"
                    description="Search, filter, and sort products from the server."
                />

                <DataTable
                    columns={columns}
                    paginator={products}
                    query={query}
                    url={(params) => index.url({ query: params })}
                    reload={reload}
                    filterFields={[
                        {
                            id: 'status',
                            label: 'Status',
                            options: statuses,
                        },
                        {
                            id: 'category',
                            label: 'Category',
                            options: categories.map((category) => ({
                                value: category,
                                label: category,
                            })),
                        },
                    ]}
                />
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: index(),
        },
    ],
};
