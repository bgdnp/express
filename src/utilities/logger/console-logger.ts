import { container } from '@di/container';
import { LogLevel } from '../../common/enums/log-level';
import { Logger } from './logger.interface';
import { LOG_LEVEL } from './constants';

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
