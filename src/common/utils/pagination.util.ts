import { PaginationMeta } from '../http/api-response.interface';

export interface PaginationParams {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  itemCount: number;
}

export function buildPaginationMeta(params: PaginationParams): PaginationMeta {
  const safeItemsPerPage = Math.max(1, params.itemsPerPage);
  const totalPages =
    params.totalItems === 0
      ? 0
      : Math.ceil(params.totalItems / safeItemsPerPage);
  const hasNextPage = params.currentPage < totalPages;
  const hasPreviousPage = params.currentPage > 1 && totalPages > 0;

  return {
    totalItems: params.totalItems,
    itemCount: params.itemCount,
    itemsPerPage: safeItemsPerPage,
    totalPages,
    currentPage: params.currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? params.currentPage + 1 : null,
    prevPage: hasPreviousPage ? params.currentPage - 1 : null,
  };
}
