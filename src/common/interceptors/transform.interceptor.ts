import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../http/api-response.interface';
import { isPaginatedResult } from '../http/paginated-result.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<{ headersSent?: boolean }>();

    if (response.headersSent) {
      return next.handle() as Observable<ApiResponse<T>>;
    }

    return next.handle().pipe(
      map((value: unknown) => {
        if (isPaginatedResult(value)) {
          return {
            success: true,
            data: value.items as T,
            error: null,
            meta: value.meta,
          } satisfies ApiResponse<T>;
        }

        return {
          success: true,
          data: value as T,
          error: null,
          meta: null,
        } satisfies ApiResponse<T>;
      }),
    );
  }
}
