<?php

namespace App\Http\Requests;

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', Rule::in([10, 25, 50, 100])],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'sort' => ['sometimes', 'nullable', 'string', 'max:255'],
            'direction' => ['sometimes', 'nullable', 'in:asc,desc'],
            'filters' => ['sometimes', 'array'],
            'filters.status' => ['sometimes', 'nullable', Rule::enum(ProductStatus::class)],
            'filters.category' => ['sometimes', 'nullable', Rule::in(Product::CATEGORIES)],
        ];
    }

    /**
     * @return array{
     *     search: string|null,
     *     sort: string|null,
     *     direction: string|null,
     *     per_page: int,
     *     page: int,
     *     filters: array<string, string>
     * }
     */
    public function dataTable(): array
    {
        $validated = $this->validated();
        $filters = [];

        foreach ($validated['filters'] ?? [] as $key => $value) {
            if (is_string($key) && is_string($value) && $value !== '') {
                $filters[$key] = $value;
            }
        }

        return [
            'search' => $validated['search'] ?? null,
            'sort' => $validated['sort'] ?? null,
            'direction' => $validated['direction'] ?? null,
            'per_page' => (int) ($validated['per_page'] ?? 10),
            'page' => (int) ($validated['page'] ?? 1),
            'filters' => $filters,
        ];
    }
}
