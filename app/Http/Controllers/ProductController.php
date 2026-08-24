<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Requests\IndexProductRequest;
use App\Models\Product;
use App\Support\DataTable\DataTableQuery;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function __invoke(IndexProductRequest $request): Response
    {
        $query = $request->dataTable();

        $products = (new DataTableQuery(
            searchable: ['name', 'sku'],
            sortable: ['name', 'sku', 'category', 'price', 'status', 'stock', 'created_at'],
            filterable: ['status', 'category'],
        ))->paginate(
            Product::query()->select([
                'id',
                'name',
                'sku',
                'category',
                'price',
                'status',
                'stock',
                'created_at',
            ]),
            $query,
        );

        return Inertia::render('products/index', [
            'products' => $products,
            'query' => [
                ...$query,
                'filters' => (object) $query['filters'],
            ],
            'categories' => Product::CATEGORIES,
            'statuses' => collect(ProductStatus::cases())
                ->map(fn (ProductStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->all(),
        ]);
    }
}
