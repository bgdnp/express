import { ArgsMapper, DefaultRequest, Handler } from '@common/types';
import { RouterMetadata } from '../router-metadata';

export function Args<T extends Partial<DefaultRequest> = DefaultRequest>(mapper: ArgsMapper<T>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (handler: Handler, context: ClassMethodDecoratorContext) => {
    const route = RouterMetadata.getRoute(handler);
    const metadata = { ...route, argsMapper: mapper as ArgsMapper };

    RouterMetadata.setRoute(handler, metadata);
  };
}
