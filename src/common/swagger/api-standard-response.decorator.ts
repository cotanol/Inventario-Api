import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

function buildErrorResponseSchema(code: string, message: string) {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      data: { nullable: true, example: null },
      error: {
        type: 'object',
        properties: {
          code: { type: 'string', example: code },
          message: { type: 'string', example: message },
          details: { nullable: true, example: null },
        },
      },
      meta: { nullable: true, example: null },
    },
  };
}

interface ItemResponseOptions {
  isArray?: boolean;
  dataExample?: unknown;
}

export function ApiPaginationQueryDocs() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Numero de pagina (inicia en 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Cantidad de elementos por pagina',
    }),
  );
}

export function ApiStandardListResponse(
  description: string,
  itemExample?: unknown,
) {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { type: 'object' },
            ...(itemExample !== undefined ? { example: [itemExample] } : {}),
          },
          error: { nullable: true, example: null },
          meta: {
            type: 'object',
            properties: {
              pagination: {
                type: 'object',
                properties: {
                  totalItems: { type: 'number', example: 100 },
                  itemCount: { type: 'number', example: 10 },
                  itemsPerPage: { type: 'number', example: 10 },
                  totalPages: { type: 'number', example: 10 },
                  currentPage: { type: 'number', example: 1 },
                  hasNextPage: { type: 'boolean', example: true },
                  hasPreviousPage: { type: 'boolean', example: false },
                  nextPage: { type: 'number', nullable: true, example: 2 },
                  prevPage: { type: 'number', nullable: true, example: null },
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Solicitud invalida',
      schema: buildErrorResponseSchema('BAD_REQUEST', 'Solicitud invalida'),
    }),
    ApiUnauthorizedResponse({
      description: 'No autenticado',
      schema: buildErrorResponseSchema('UNAUTHORIZED', 'No autenticado'),
    }),
    ApiForbiddenResponse({
      description: 'Sin permisos',
      schema: buildErrorResponseSchema('FORBIDDEN', 'Sin permisos'),
    }),
    ApiNotFoundResponse({
      description: 'Recurso no encontrado',
      schema: buildErrorResponseSchema('NOT_FOUND', 'Recurso no encontrado'),
    }),
    ApiConflictResponse({
      description: 'Conflicto de datos',
      schema: buildErrorResponseSchema('CONFLICT', 'Conflicto de datos'),
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno',
      schema: buildErrorResponseSchema(
        'INTERNAL_SERVER_ERROR',
        'Error interno del servidor',
      ),
    }),
  );
}

export function ApiStandardItemResponse(
  description: string,
  status: 'ok' | 'created' = 'ok',
  options?: ItemResponseOptions,
) {
  const dataSchema = options?.isArray
    ? {
        type: 'array',
        items: { type: 'object' },
        nullable: true,
      }
    : {
        type: 'object',
        additionalProperties: true,
        nullable: true,
      };

  const dataSchemaWithExample = {
    ...dataSchema,
    ...(options?.dataExample !== undefined
      ? { example: options.dataExample }
      : {}),
  };

  const successDecorator =
    status === 'created'
      ? ApiCreatedResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: dataSchemaWithExample,
              error: { nullable: true, example: null },
              meta: { nullable: true, example: null },
            },
          },
        })
      : ApiOkResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: dataSchemaWithExample,
              error: { nullable: true, example: null },
              meta: { nullable: true, example: null },
            },
          },
        });

  return applyDecorators(
    successDecorator,
    ApiBadRequestResponse({
      description: 'Solicitud invalida',
      schema: buildErrorResponseSchema('BAD_REQUEST', 'Solicitud invalida'),
    }),
    ApiUnauthorizedResponse({
      description: 'No autenticado',
      schema: buildErrorResponseSchema('UNAUTHORIZED', 'No autenticado'),
    }),
    ApiForbiddenResponse({
      description: 'Sin permisos',
      schema: buildErrorResponseSchema('FORBIDDEN', 'Sin permisos'),
    }),
    ApiNotFoundResponse({
      description: 'Recurso no encontrado',
      schema: buildErrorResponseSchema('NOT_FOUND', 'Recurso no encontrado'),
    }),
    ApiConflictResponse({
      description: 'Conflicto de datos',
      schema: buildErrorResponseSchema('CONFLICT', 'Conflicto de datos'),
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno',
      schema: buildErrorResponseSchema(
        'INTERNAL_SERVER_ERROR',
        'Error interno del servidor',
      ),
    }),
  );
}
