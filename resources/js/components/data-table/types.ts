import type { QueryParams } from '@/wayfinder';

export type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type DataTableQueryState = {
    search: string | null;
    sort: string | null;
    direction: 'asc' | 'desc' | null;
    per_page: number;
    page: number;
    filters: Record<string, string>;
};

export type DataTableFilterOption = {
    value: string;
    label: string;
};

export type DataTableFilterField = {
    id: string;
    label: string;
    options: DataTableFilterOption[];
};

export type DataTableUrl = (query: QueryParams) => string;
