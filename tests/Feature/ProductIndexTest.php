<?php

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('products.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view products', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('products/index')
            ->has('products.data', 1)
            ->where('products.data.0.id', $product->id)
            ->where('products.per_page', 10)
            ->has('categories')
            ->has('statuses')
            ->where('query.page', 1),
        );
});

test('search filters products by name', function () {
    $user = User::factory()->create();
    $match = Product::factory()->create(['name' => 'Laravel Shirt']);
    Product::factory()->create(['name' => 'Vue Mug']);

    $this->actingAs($user)
        ->get(route('products.index', ['search' => 'Shirt']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
            ->where('query.search', 'Shirt'),
        );
});

test('search filters products by sku', function () {
    $user = User::factory()->create();
    $match = Product::factory()->create(['sku' => 'AB12-9999']);
    Product::factory()->create(['sku' => 'ZZ00-1111']);

    $this->actingAs($user)
        ->get(route('products.index', ['search' => 'AB12-9999']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id),
        );
});

test('products can be filtered by status', function () {
    $user = User::factory()->create();
    $match = Product::factory()->create(['status' => ProductStatus::Published]);
    Product::factory()->create(['status' => ProductStatus::Draft]);

    $this->actingAs($user)
        ->get(route('products.index', ['filters' => ['status' => 'published']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
            ->where('query.filters.status', 'published'),
        );
});

test('products can be filtered by category', function () {
    $user = User::factory()->create();
    $match = Product::factory()->create(['category' => 'Electronics']);
    Product::factory()->create(['category' => 'Clothing']);

    $this->actingAs($user)
        ->get(route('products.index', ['filters' => ['category' => 'Electronics']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
            ->where('query.filters.category', 'Electronics'),
        );
});

test('products can be sorted by an allowed column', function () {
    $user = User::factory()->create();
    Product::factory()->create(['name' => 'Zulu']);
    Product::factory()->create(['name' => 'Alpha']);

    $this->actingAs($user)
        ->get(route('products.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.name', 'Alpha')
            ->where('products.data.1.name', 'Zulu')
            ->where('query.sort', 'name')
            ->where('query.direction', 'asc'),
        );
});

test('invalid sort columns fall back to id descending', function () {
    $user = User::factory()->create();
    $older = Product::factory()->create(['name' => 'Older']);
    $newer = Product::factory()->create(['name' => 'Newer']);

    $this->actingAs($user)
        ->get(route('products.index', ['sort' => 'password', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.id', $newer->id)
            ->where('products.data.1.id', $older->id),
        );
});

test('per page is respected', function () {
    $user = User::factory()->create();
    Product::factory()->count(15)->create();

    $this->actingAs($user)
        ->get(route('products.index', ['per_page' => 10]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 10)
            ->where('products.per_page', 10)
            ->where('products.total', 15),
        );
});

test('products can be paginated', function () {
    $user = User::factory()->create();
    Product::factory()->count(15)->create();

    $this->actingAs($user)
        ->get(route('products.index', ['page' => 2, 'per_page' => 10]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 5)
            ->where('products.current_page', 2)
            ->where('products.last_page', 2),
        );
});

test('combined search and filter query string is preserved', function () {
    $user = User::factory()->create();
    $match = Product::factory()->create([
        'name' => 'Laravel Shirt',
        'status' => ProductStatus::Published,
    ]);
    Product::factory()->create([
        'name' => 'Laravel Mug',
        'status' => ProductStatus::Draft,
    ]);
    Product::factory()->create([
        'name' => 'Vue Shirt',
        'status' => ProductStatus::Published,
    ]);

    $this->actingAs($user)
        ->get(route('products.index', [
            'search' => 'Laravel Shirt',
            'filters' => ['status' => 'published'],
            'sort' => 'name',
            'direction' => 'asc',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
            ->where('query.search', 'Laravel Shirt')
            ->where('query.filters.status', 'published')
            ->where('query.sort', 'name'),
        );
});
