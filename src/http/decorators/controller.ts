import { ControllerConstructor, RoutePath } from '@common/types';

import { RouterMetadata } from '../router-metadata';

export function Controller(prefix: RoutePath = '/') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <C extends ControllerConstructor>(cls: C, context: ClassDecoratorContext) => {
    RouterMetadata.setController(cls, { prefix, cls });
  };
}
