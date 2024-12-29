import { ErrorCode, HttpStatus } from '@common/enums';
import { Exception } from '@common/exception';
import { HandlerResult } from '@common/types';
import { HttpException } from '@http/exceptions';
import { NEXT, SKIP } from '@http/http-middleware';
import express from 'express';

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
    if (result === NEXT) {
      return next();
    }

    if (result === SKIP) {
      return next(skip);
    }

    throw new Error();
  }

  return handleSuccess(result, res);
}

export function handleError(err: unknown, res: express.Response) {
  if (err instanceof HttpException) {
    return res.status(err.status).json(err.response);
  }

  if (err instanceof Exception) {
    return res.status(HttpStatus.InternalServerError).json(err.response);
  }

  return res.status(HttpStatus.InternalServerError).json({ code: ErrorCode.UnexpectedError });
}
