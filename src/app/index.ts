import { LogLevel } from '@common/enums';
import { Constructor, ControllerConstructor } from '@common/types';
import { container } from '@di/container';
import { ConsoleLogger, LOG_LEVEL, LOGGER, Logger } from '@utilities/logger';
import express from 'express';
import { useController } from './use-controller';

type CreateAppOptions = {
  logger: Constructor<Logger>;
  logLevel: LogLevel;
};

export function createApp(options?: CreateAppOptions) {
  container.set({ key: LOG_LEVEL, value: options?.logLevel ?? LogLevel.Debug });
  container.set({ key: LOGGER, cls: options?.logger ?? ConsoleLogger });

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
