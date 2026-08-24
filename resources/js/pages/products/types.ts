export type ProductStatus = 'draft' | 'published' | 'archived';

export type Product = {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: string;
    status: ProductStatus;
    stock: number;
    created_at: string;
};
