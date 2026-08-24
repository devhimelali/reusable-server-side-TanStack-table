<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'sku' => strtoupper(fake()->unique()->bothify('??##-####')),
            'category' => fake()->randomElement(Product::CATEGORIES),
            'price' => fake()->randomFloat(2, 5, 999),
            'status' => fake()->randomElement(ProductStatus::cases()),
            'stock' => fake()->numberBetween(0, 500),
        ];
    }
}
