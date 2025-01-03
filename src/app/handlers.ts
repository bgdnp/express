import express from 'express';

import { CONTEXT } from '@common/constants';
import { ArgsMapper, Handler } from '@common/types';

import { container } from '@di/container';

import { HttpMiddleware } from '@http/http-middleware';
import { HttpRequest } from '@http/http-request';

import { handleError, handleMiddleware, handleSuccess } from './response-handlers';

export function createHandler(handler: Handler, argsMapper: ArgsMapper): express.Handler {
  return (req, res) => {
    container.set({ key: CONTEXT, value: 'handler' });

    const request = new HttpRequest(req);
    const args = argsMapper(request);

    handler(...args)
      .then((result) => handleSuccess(result, res))
      .catch((err) => handleError(err, res));
  };
}

export function createMiddleware(
  middleware: HttpMiddleware,
  skip: 'route' | 'router',
): express.Handler {
  return (req, res, next) => {
    container.set({ key: CONTEXT, value: 'handler' });

    const request = new HttpRequest(req);

    middleware
      .handle(request)
      .then((result) => handleMiddleware(result, res, next, skip))
      .catch((err) => handleError(err, res));
  };
}
