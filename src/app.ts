import { ErrorCode, HttpStatus } from '@common/enums';
import { Exception } from '@common/exception';
import { ArgsMapper, ControllerConstructor, Handler, HandlerResult } from '@common/types';
import { HttpException } from '@http/exceptions';
import { HttpMiddleware, NEXT, SKIP } from '@http/http-middleware';
import { HttpRequest } from '@http/http-request';
import { RouterMetadata } from '@http/router-metadata';
import express from 'express';

function handleSuccess(result: HandlerResult, res: express.Response) {
  if (result.status === 204) {
    return res.status(result.status).send();
  }

  return res.status(result.status).json(result.body);
}

function handleMiddleware(
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

function handleError(err: unknown, res: express.Response) {
  if (err instanceof HttpException) {
    return res.status(err.status).json(err.response);
  }

  if (err instanceof Exception) {
    return res.status(HttpStatus.InternalServerError).json(err.response);
  }

  return res.status(HttpStatus.InternalServerError).json({ code: ErrorCode.UnexpectedError });
}

function createHandler(handler: Handler, argsMapper?: ArgsMapper): express.Handler {
  return (req, res) => {
    const request = new HttpRequest(req);
    const args = argsMapper ? argsMapper(request) : [request];

    handler(...args)
      .then((result) => handleSuccess(result, res))
      .catch((err) => handleError(err, res));
  };
}

function createMiddleware(middleware: HttpMiddleware, skip: 'route' | 'router'): express.Handler {
  return (req, res, next) => {
    const request = new HttpRequest(req);

    middleware
      .handle(request)
      .then((result) => handleMiddleware(result, res, next, skip))
      .catch((err) => handleError(err, res));
  };
}

function useController(app: express.Express, controller: ControllerConstructor) {
  const metadata = RouterMetadata.getController(controller);

  if (!metadata) {
    throw new Error();
  }

  const router = express.Router();
  const instance = new controller();

  metadata.middlewares?.forEach((middleware) => {
    router.use(createMiddleware(middleware, 'router'));
  });

  metadata.routes.forEach(({ method, path, handler, argsMapper, middlewares }) => {
    middlewares?.forEach((middleware) => {
      router[method](path, createMiddleware(middleware, 'route'));
    });

    router[method](path, createHandler(handler.bind(instance), argsMapper));
  });

  app.use(metadata.prefix, router);
}

export function createApp() {
  const app = express();

  return Object.assign(app, {
    useController: (controller: ControllerConstructor) => {
      useController(app, controller);
    },
    useControllers: (
      controllers: ControllerConstructor[] | Record<string, ControllerConstructor>,
    ) => {
      if (!Array.isArray(controllers)) {
        controllers = Object.values(controllers);
      }

      controllers.forEach((controller) => {
        useController(app, controller);
      });
    },
  });
}
