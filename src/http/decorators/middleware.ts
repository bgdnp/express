import { ControllerConstructor, Handler } from '@common/types';
import { HttpMiddleware } from '../http-middleware';
import { RouterMetadata } from '@http/router-metadata';

function routeMiddleware(handler: Handler, middleware: HttpMiddleware) {
  const route = RouterMetadata.getRoute(handler);
  const middlewares = route?.middlewares ?? [];
  const metadata = { ...(route ?? {}), middlewares: [...middlewares, middleware] };

  RouterMetadata.setRoute(handler, metadata);
}

function controllerMiddleware(cls: ControllerConstructor, middleware: HttpMiddleware) {
  const controller = RouterMetadata.getController(cls);
  const middlewares = controller?.middlewares ?? [];
  const metadata = { ...(controller ?? {}), middlewares: [...middlewares, middleware] };

  RouterMetadata.setController(cls, metadata);
}

export function Middleware(middleware: HttpMiddleware) {
  return (target: Handler | ControllerConstructor, context: DecoratorContext) => {
    if (context.kind === 'method') {
      routeMiddleware(target as Handler, middleware);
    }

    if (context.kind === 'class') {
      controllerMiddleware(target as ControllerConstructor, middleware);
    }
  };
}
