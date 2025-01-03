import { Enumerate } from '@common/types';

export const LogLevel = {
  Off: 0,
  Error: 1,
  Warn: 2,
  Info: 3,
  Debug: 4,
} as const;

export type LogLevel = Enumerate<typeof LogLevel>;
