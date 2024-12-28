import { container } from '..';
import { Constructor } from '../../types';

export function Inject<T>(keyOrCls: string | Constructor<T>) {
  const key = typeof keyOrCls === 'string' ? keyOrCls : keyOrCls.name;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <This extends object>(target: undefined, context: ClassFieldDecoratorContext) => {
    return function (this: This) {
      return container.get<T>(key);
    };
  };
}
