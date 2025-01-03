import { Constructor, ControllerConstructor, Handler } from '@common/types';

import { RouterMetadata } from '@http/router-metadata';

import { HttpMiddleware } from '../http-middleware';

function routeMiddleware(handler: Handler, middlewares: Constructor<HttpMiddleware>[]) {
  RouterMetadata.setRoute(handler, { middlewares: middlewares.map((mw) => new mw()) });
}

function controllerMiddleware(
  cls: ControllerConstructor,
  middlewares: Constructor<HttpMiddleware>[],
) {
  RouterMetadata.setController(cls, { middlewares: middlewares.map((mw) => new mw()) });
}

export function Middleware(...middlewares: Constructor<HttpMiddleware>[]) {
  return (target: Handler | ControllerConstructor, context: DecoratorContext) => {
    if (context.kind === 'method') {
      routeMiddleware(target as Handler, middlewares);
    }

    if (context.kind === 'class') {
      controllerMiddleware(target as ControllerConstructor, middlewares);
    }
  };
}
