import { Constructor } from '@common/types';
import { container } from '../container';

export function Inject<T>(keyOrCls: string | symbol | Constructor<T>) {
  const key =
    typeof keyOrCls === 'string' || typeof keyOrCls === 'symbol' ? keyOrCls : keyOrCls.name;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <This extends object>(target: undefined, context: ClassFieldDecoratorContext) => {
    return function (this: This) {
      return container.get<T>(key);
    };
  };
}
