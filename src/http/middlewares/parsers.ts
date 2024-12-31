import { HandlerResult } from '@common/types';
import { HttpRequest } from '@http/http-request';
import { HttpMiddleware } from '../http-middleware';
import { ValidationException } from '@http/exceptions';

type Schema<T> = {
  parse: (data: unknown) => T;
};

class Parser<T> extends HttpMiddleware {
  constructor(
    private key: 'body' | 'params' | 'query',
    private schema: Schema<T>,
  ) {
    super();
  }

  async handle(request: HttpRequest<object>): Promise<HandlerResult | symbol> {
    try {
      const parsed = this.schema.parse(request[this.key]);

      request.modify({
        [this.key]: parsed,
      });

      return this.next();
    } catch (err) {
      throw new ValidationException({ cause: err as Error });
    }
  }
}

export class BodyParser<T> extends Parser<T> {
  constructor(schema: Schema<T>) {
    super('body', schema);
  }
}

export class ParamsParser<T> extends Parser<T> {
  constructor(schema: Schema<T>) {
    super('params', schema);
  }
}

export class QueryParser<T> extends Parser<T> {
  constructor(schema: Schema<T>) {
    super('query', schema);
  }
}
