import express from 'express';

import { ControllerConstructor } from '@common/types';

import { RouterMetadata } from '@http/router-metadata';

import { createHandler, createMiddleware } from './handlers';

export function useController(app: express.Express, controller: ControllerConstructor) {
  const metadata = RouterMetadata.getController(controller);

  if (!metadata) {
    throw new Error();
  }

  const router = express.Router();
  const instance = new controller();

  metadata.middlewares.forEach((middleware) => {
    router.use(createMiddleware(middleware, 'router'));
  });

  metadata.routes.forEach(({ method, path, handler, argsMapper, middlewares }) => {
    middlewares.forEach((middleware) => {
      router[method](path, createMiddleware(middleware, 'route'));
    });

    router[method](path, createHandler(handler.bind(instance), argsMapper));
  });

  app.use(metadata.prefix, router);
}
