import express from 'express';
import { ControllerConstructor, Handler } from './types';
import { RouterMetadata } from './http/router-metadata';

function createHandler(handler: Handler): express.Handler {
  return (req, res) => {
    handler(req)
      .then((result) => {
        res.status(result.status).json(result.body);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };
}

function useController(app: express.Express, controller: ControllerConstructor) {
  const metadata = RouterMetadata.getController(controller.name);
  const router = express.Router();
  const instance = new metadata.cls();

  metadata.routes.forEach(({ method, path, handler }) => {
    router[method](path, createHandler(handler.bind(instance)));
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
