import { ArgsMapper, DefaultRequest, Handler } from '@common/types';

import { RouterMetadata } from '../router-metadata';

export function Args<T extends Partial<DefaultRequest> = DefaultRequest>(
  argsMapper: ArgsMapper<T>,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (handler: Handler, context: ClassMethodDecoratorContext) => {
    RouterMetadata.setRoute(handler, { argsMapper: argsMapper as ArgsMapper });
  };
}
