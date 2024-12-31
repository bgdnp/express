import { Constructor } from '@common/types';

import { container } from '../container';

export function Service(key?: string | symbol) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <C extends Constructor>(cls: C, context: ClassDecoratorContext) => {
    container.set({ key: key ?? cls.name, cls });
  };
}
