type ExceptionOptions = {
  code: string;
  message?: string;
  cause?: Error;
};

export class Exception extends Error {
  readonly code: string;

  constructor(options: ExceptionOptions) {
    super(options.message ?? options.code, { cause: options.cause });
    this.code = options.code;
  }

  get response(): { code: string; message: string } {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
