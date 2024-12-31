import { LOG_LEVEL } from '@common/constants';
import { LogLevel } from '@common/enums';

import { container } from '@di/container';

import { Logger } from './logger.interface';

export class ConsoleLogger implements Logger {
  private level: LogLevel;

  constructor() {
    this.level = container.get<LogLevel>(LOG_LEVEL);
  }

  error(...data: unknown[]): void {
    if (this.level >= LogLevel.Error) {
      console.error('ERROR:', ...data);
    }
  }

  warn(...data: unknown[]): void {
    if (this.level >= LogLevel.Warn) {
      console.warn('WARN:', ...data);
    }
  }

  info(...data: unknown[]): void {
    if (this.level >= LogLevel.Info) {
      console.info('INFO:', ...data);
    }
  }

  debug(...data: unknown[]): void {
    if (this.level >= LogLevel.Debug) {
      console.debug('DEBUG:', ...data);
    }
  }
}
