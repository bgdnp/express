import { ControllerConstructor, Handler } from '@common/types';

import { RouterMetadata } from '@http/router-metadata';

import { HttpMiddleware } from '../http-middleware';

function routeMiddleware(handler: Handler, middlewares: HttpMiddleware[]) {
  const route = RouterMetadata.getRoute(handler);
  const metadata = {
    ...(route ?? {}),
    middlewares: [...(route?.middlewares ?? []), ...middlewares],
  };

  RouterMetadata.setRoute(handler, metadata);
}

function controllerMiddleware(cls: ControllerConstructor, middlewares: HttpMiddleware[]) {
  const controller = RouterMetadata.getController(cls);
  const metadata = {
    ...(controller ?? {}),
    middlewares: [...(controller?.middlewares ?? []), ...middlewares],
  };

  RouterMetadata.setController(cls, metadata);
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
