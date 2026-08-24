import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createTableHook,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
} from '@tanstack/react-table';

export const dataTableFeatures = tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    columnVisibilityFeature,
    rowSelectionFeature,
});

export const { createAppColumnHelper, useAppTable } = createTableHook({
    features: dataTableFeatures,
    getRowId: (row) => String((row as { id: number | string }).id),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableMultiSort: false,
    autoResetPageIndex: false,
});
