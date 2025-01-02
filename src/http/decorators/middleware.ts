import { ControllerConstructor, Handler } from '@common/types';

import { RouterMetadata } from '@http/router-metadata';

import { HttpMiddleware } from '../http-middleware';

function routeMiddleware(handler: Handler, middlewares: HttpMiddleware[]) {
  RouterMetadata.setRoute(handler, { middlewares });
}

function controllerMiddleware(cls: ControllerConstructor, middlewares: HttpMiddleware[]) {
  RouterMetadata.setController(cls, { middlewares });
}

export function Middleware(...middlewares: HttpMiddleware[]) {
  return (target: Handler | ControllerConstructor, context: DecoratorContext) => {
    if (context.kind === 'method') {
      routeMiddleware(target as Handler, middlewares);
    }

    if (context.kind === 'class') {
      controllerMiddleware(target as ControllerConstructor, middlewares);
    }
  };
}
