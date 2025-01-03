import { Enumerate } from '@common/types';

export const ErrorCode = {
  NoSuchKey: 'NO_SUCH_KEY',
  ValidationFailed: 'VALIDATION_FAILED',
  Unauthorized: 'UNAUTHORIZED',
  NotFound: 'NOT_FOUND',
  UnexpectedError: 'UNEXPECTED_ERROR',
  RequestModificationForbidden: 'REQUEST_MODIFICATION_FORBIDDEN',
} as const;

export type ErrorCode = Enumerate<typeof ErrorCode>;
