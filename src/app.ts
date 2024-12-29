import { ErrorCode, HttpStatus } from '@common/enums';
import { Exception } from '@common/exception';
import { ControllerConstructor, Handler, HandlerResult } from '@common/types';
import { HttpException } from '@http/exceptions';
import { HttpRequest } from '@http/http-request';
import { RouterMetadata } from '@http/router-metadata';
import express from 'express';

function handleSuccess(result: HandlerResult, res: express.Response) {
  if (result.status === 204) {
    return res.status(result.status).send();
  }

  return res.status(result.status).json(result.body);
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

function createHandler(handler: Handler): express.Handler {
  return (req, res) => {
    const request = new HttpRequest(req);

    handler(request)
      .then((result) => handleSuccess(result, res))
      .catch((err) => handleError(err, res));
  };
}

function useController(app: express.Express, controller: ControllerConstructor) {
  const { prefix, cls, routes } = RouterMetadata.getController(controller.name);
  const router = express.Router();
  const instance = new cls();

  routes.forEach(({ method, path, handler }) => {
    router[method](path, createHandler(handler.bind(instance)));
  });

  app.use(prefix, router);
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
