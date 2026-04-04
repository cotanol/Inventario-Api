import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const RawHeaders = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const rawHeaders = req.rawHeaders;

    if (!rawHeaders) {
      throw new InternalServerErrorException(
        'Raw Headers not found in request',
      );
    }

    return rawHeaders;
  },
);
