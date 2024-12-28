import express from 'express';

type DefaultRequest = {
  Body: unknown;
  Params: unknown;
  Query: unknown;
};
type SpecifiedRequest<T extends Partial<DefaultRequest>> = T & Omit<DefaultRequest, keyof T>;
type Body<T extends Partial<DefaultRequest>> = SpecifiedRequest<T>['Body'];
type Params<T extends Partial<DefaultRequest>> = SpecifiedRequest<T>['Params'];
type Query<T extends Partial<DefaultRequest>> = SpecifiedRequest<T>['Query'];

type Parser<T> = { parse: (input: unknown) => T };
type Parsers<T extends Partial<DefaultRequest>> = {
  body?: Parser<Body<T>>;
  params?: Parser<Params<T>>;
  query?: Parser<Query<T>>;
};

export class HttpRequest<T extends Partial<DefaultRequest>> {
  private readonly req: express.Request;
  private readonly parsers: Parsers<T>;
  private _body: Body<T> = undefined;
  private _params: Params<T> = undefined;
  private _query: Query<T> = undefined;

  constructor(req: express.Request, parsers?: Parsers<T>) {
    this.req = req;
    this.parsers = parsers ?? {};
  }

  get body(): Body<T> {
    if (!this._body) {
      const parser = this.parsers.body;
      this._body = parser ? parser.parse(this.req.body) : (this.req.body as Body<T>);
    }

    return this._body;
  }

  get params(): Params<T> {
    if (!this._params) {
      const parser = this.parsers.params;
      this._params = parser ? parser.parse(this.req.params) : (this.req.params as Params<T>);
    }

    return this._params;
  }

  get query(): Query<T> {
    if (!this._query) {
      const parser = this.parsers.query;
      this._query = parser ? parser.parse(this.req.query) : (this.req.query as Query<T>);
    }

    return this._query;
  }

  get headers(): Record<string, string> {
    return this.req.headers as Record<string, string>;
  }
}
