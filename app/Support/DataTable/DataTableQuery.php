<?php

namespace App\Support\DataTable;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class DataTableQuery
{
    /**
     * @param  list<string>  $searchable
     * @param  list<string>  $sortable
     * @param  list<string>  $filterable
     * @param  list<int>  $perPageOptions
     */
    public function __construct(
        private array $searchable = [],
        private array $sortable = [],
        private array $filterable = [],
        private string $defaultSort = 'id',
        private string $defaultDirection = 'desc',
        private int $defaultPerPage = 10,
        private array $perPageOptions = [10, 25, 50, 100],
    ) {}

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     * @param  array{
     *     search?: string|null,
     *     sort?: string|null,
     *     direction?: string|null,
     *     filters?: array<string, mixed>,
     *     per_page?: int|string|null,
     * }  $params
     * @return LengthAwarePaginator<int, TModel>
     */
    public function paginate(Builder $query, array $params): LengthAwarePaginator
    {
        $this->applySearch($query, $params['search'] ?? null);
        $this->applyFilters($query, $params['filters'] ?? []);
        $this->applySort($query, $params['sort'] ?? null, $params['direction'] ?? null);

        return $query
            ->paginate($this->resolvePerPage($params['per_page'] ?? null))
            ->withQueryString();
    }

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    private function applySearch(Builder $query, ?string $search): void
    {
        if ($search === null || $search === '' || $this->searchable === []) {
            return;
        }

        $term = '%'.addcslashes($search, '%_\\').'%';

        $query->whereAny($this->searchable, 'like', $term);
    }

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        foreach ($this->filterable as $column) {
            $value = $filters[$column] ?? null;

            if ($value === null || $value === '') {
                continue;
            }

            $query->where($column, $value);
        }
    }

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    private function applySort(Builder $query, ?string $sort, ?string $direction): void
    {
        if ($sort !== null && in_array($sort, $this->sortable, true)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');

            return;
        }

        $query->orderBy($this->defaultSort, $this->defaultDirection === 'asc' ? 'asc' : 'desc');
    }

    private function resolvePerPage(int|string|null $perPage): int
    {
        $perPage = (int) $perPage;

        if (in_array($perPage, $this->perPageOptions, true)) {
            return $perPage;
        }

        return $this->defaultPerPage;
    }
}
