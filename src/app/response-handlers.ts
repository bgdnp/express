import express from 'express';

import { LOGGER, MIDDLEWARE_NEXT, MIDDLEWARE_SKIP } from '@common/constants';
import { ErrorCode, HttpStatus } from '@common/enums';
import { Exception } from '@common/exception';
import { HandlerResult } from '@common/types';

import { container } from '@di/container';

import { HttpException } from '@http/exceptions';

import { Logger } from '@utilities/logger';

export function handleSuccess(result: HandlerResult, res: express.Response) {
  if (result.status === 204) {
    return res.status(result.status).send();
  }

  return res.status(result.status).json(result.body);
}

export function handleMiddleware(
  result: symbol | HandlerResult,
  res: express.Response,
  next: express.NextFunction,
  skip: 'route' | 'router',
) {
  if (typeof result === 'symbol') {
    if (result === MIDDLEWARE_NEXT) {
      return next();
    }

    if (result === MIDDLEWARE_SKIP) {
      return next(skip);
    }

    throw new Error();
  }

  return handleSuccess(result, res);
}

export function handleError(err: unknown, res: express.Response) {
  const logger = container.get<Logger>(LOGGER);

  logger.error(err);

  if (err instanceof HttpException) {
    return res.status(err.status).json(err.response);
  }

  if (err instanceof Exception) {
    return res.status(HttpStatus.InternalServerError).json(err.response);
  }

  return res.status(HttpStatus.InternalServerError).json({ code: ErrorCode.UnexpectedError });
}
