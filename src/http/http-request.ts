import express from 'express';

import { CONTEXT } from '@common/constants';
import { ErrorCode } from '@common/enums';
import { Exception } from '@common/exception';
import { DefaultRequest } from '@common/types';

import { container } from '@di/container';

type SpecifiedRequest<T extends Partial<DefaultRequest>> = T & Omit<DefaultRequest, keyof T>;
type Body<T extends Partial<DefaultRequest>> = SpecifiedRequest<T>['Body'];
type Params<T extends Partial<DefaultRequest>> = SpecifiedRequest<T>['Params'];
type Query<T extends Partial<DefaultRequest>> = SpecifiedRequest<T>['Query'];

type RequestModifier<T extends Partial<DefaultRequest>> = Partial<Omit<HttpRequest<T>, 'modify'>>;

export class HttpRequest<T extends Partial<DefaultRequest> = DefaultRequest> {
  constructor(private req: express.Request) {}

  get body(): Body<T> {
    return this.req.body;
  }

  get headers(): Record<string, string> {
    return this.req.headers as Record<string, string>;
  }

  get params(): Params<T> {
    return this.req.params;
  }

  get query(): Query<T> {
    return this.req.query;
  }

  modify(data: RequestModifier<T>): HttpRequest<T> {
    if (container.get<string>(CONTEXT) !== 'middleware') {
      throw new Exception({
        code: ErrorCode.RequestModificationForbidden,
        message: 'Modifying request outside middleware is not allowed.',
      });
    }

    const keys = Object.keys(data) as unknown as (keyof RequestModifier<T>)[];

    keys.forEach((key) => {
      this.req[key] = data[key];
    });

    return this;
  }
}
