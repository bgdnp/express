import express from 'express';
import { ControllerConstructor, Handler, HandlerResult } from './types';
import { RouterMetadata } from './http/router-metadata';
import { HttpRequest } from './http';

function handleSuccess(result: HandlerResult, res: express.Response) {
  if (result.status === 204) {
    return res.status(result.status).send();
  }

  return res.status(result.status).json(result.body);
}

function handleError(err: unknown, res: express.Response) {
  res.status(500).json(err);
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
