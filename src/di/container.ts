import { Constructor } from '@common/types';
import { NoSuchKeyException } from './exceptions';

type ValueMetadata<T = unknown> = {
  key: string;
  value: T;
};

type ConstructorMetadata<T = object> = {
  key: string;
  cls: Constructor<T>;
  deps?: (string | Constructor)[];
};

type FactoryMetadata<T = unknown> = {
  key: string;
  factory: (c: Container) => T;
};

type Metadata<T = unknown> = ValueMetadata<T> | ConstructorMetadata<T> | FactoryMetadata<T>;

export class Container {
  private metadata: Map<string, Metadata> = new Map();
  private pool: Map<string, unknown> = new Map();

  set<T>(metadata: Metadata<T>): Container;
  set<T>(cls: Constructor<T>): Container;
  set<T>(metadataOrCls: Metadata<T> | Constructor<T>): Container {
    const metadata: Metadata<T> =
      typeof metadataOrCls === 'function'
        ? { key: metadataOrCls.name, cls: metadataOrCls }
        : metadataOrCls;

    this.metadata.set(metadata.key, metadata);

    return this;
  }

  get<T>(key: string): T;
  get<T>(cls: Constructor<T>): T;
  get<T>(keyOrCls: string | Constructor<T>): T {
    const key = typeof keyOrCls === 'string' ? keyOrCls : keyOrCls.name;

    if (!this.pool.has(key)) {
      const metadata = this.metadata.get(key);

      if (!metadata) {
        throw new NoSuchKeyException(`Unable to resolve key: "${key}".`);
      }

      if (this.isValue(metadata)) {
        this.pool.set(metadata.key, metadata.value);
      }

      if (this.isConstructor(metadata)) {
        const dependencies =
          metadata.deps?.map((dep) => {
            const key = typeof dep === 'string' ? dep : dep.name;
            return this.get(key);
          }) ?? [];

        this.pool.set(metadata.key, new metadata.cls(...dependencies));
      }

      if (this.isFactory(metadata)) {
        this.pool.set(metadata.key, metadata.factory(this));
      }
    }

    return this.pool.get(key) as T;
  }

  private isValue<T>(metadata: Metadata<T>): metadata is ValueMetadata<T> {
    return (metadata as ValueMetadata<T>).value !== undefined;
  }

  private isConstructor<T>(metadata: Metadata<T>): metadata is ConstructorMetadata<T> {
    return (metadata as ConstructorMetadata<T>).cls !== undefined;
  }

  private isFactory<T>(metadata: Metadata<T>): metadata is FactoryMetadata<T> {
    return (metadata as FactoryMetadata<T>).factory !== undefined;
  }
}

export const container = new Container();
