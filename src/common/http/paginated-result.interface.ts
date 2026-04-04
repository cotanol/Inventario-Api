import { ApiMeta } from './api-response.interface';

export interface PaginatedResult<T = unknown> {
  items: T[];
  meta: ApiMeta;
}

export function isPaginatedResult<T = unknown>(
  value: unknown,
): value is PaginatedResult<T> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PaginatedResult<T>>;

  return (
    Array.isArray(candidate.items) &&
    !!candidate.meta &&
    typeof candidate.meta === 'object'
  );
}
