import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { ApiResponse } from '../http/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (statusCode: number) => { json: (body: unknown) => void };
      headersSent?: boolean;
    }>();

    if (response.headersSent) {
      return;
    }

    const { statusCode, body } = this.buildErrorResponse(exception);

    response.status(statusCode).json(body);
  }

  private buildErrorResponse(exception: unknown): {
    statusCode: number;
    body: ApiResponse;
  } {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          details: null,
        },
        meta: null,
      },
    };
  }

  private handlePrismaKnownError(error: Prisma.PrismaClientKnownRequestError): {
    statusCode: number;
    body: ApiResponse;
  } {
    if (error.code === 'P2002') {
      return {
        statusCode: HttpStatus.CONFLICT,
        body: {
          success: false,
          data: null,
          error: {
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
            message: 'Conflicto por valor unico duplicado',
            details: error.meta ?? null,
          },
          meta: null,
        },
      };
    }

    if (error.code === 'P2025') {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        body: {
          success: false,
          data: null,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'El recurso solicitado no existe',
            details: error.meta ?? null,
          },
          meta: null,
        },
      };
    }

    if (error.code === 'P2003') {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        body: {
          success: false,
          data: null,
          error: {
            code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
            message: 'Operacion invalida por integridad referencial',
            details: error.meta ?? null,
          },
          meta: null,
        },
      };
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      body: {
        success: false,
        data: null,
        error: {
          code: 'PRISMA_KNOWN_ERROR',
          message: 'Error de base de datos',
          details: {
            code: error.code,
            meta: error.meta ?? null,
          },
        },
        meta: null,
      },
    };
  }

  private handleHttpException(exception: HttpException): {
    statusCode: number;
    body: ApiResponse;
  } {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let details: unknown = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as {
        message?: string | string[];
        error?: string;
        [key: string]: unknown;
      };

      if (Array.isArray(responseObj.message)) {
        message = 'Error de validacion';
        details = responseObj.message;
      } else if (typeof responseObj.message === 'string') {
        message = responseObj.message;
        details = responseObj;
      } else if (typeof responseObj.error === 'string') {
        message = responseObj.error;
        details = responseObj;
      } else {
        details = responseObj;
      }
    }

    return {
      statusCode,
      body: {
        success: false,
        data: null,
        error: {
          code: this.httpStatusToCode(statusCode as HttpStatus),
          message,
          details,
        },
        meta: null,
      },
    };
  }

  private httpStatusToCode(statusCode: HttpStatus): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'HTTP_EXCEPTION';
    }
  }
}
