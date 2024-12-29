import { Handler, HttpMethod, RoutePath } from '@common/types';
import { RouterMetadata } from '../router-metadata';

function Route(method: HttpMethod, path: RoutePath) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (handler: Handler, context: ClassMethodDecoratorContext) => {
    const route = RouterMetadata.getRoute(handler) ?? {};
    const metadata = { ...route, method, path, handler };

    RouterMetadata.setRoute(handler, metadata);
  };
}

export const Get = (path: RoutePath) => Route('get', path);
export const Post = (path: RoutePath) => Route('post', path);
export const Put = (path: RoutePath) => Route('put', path);
export const Patch = (path: RoutePath) => Route('patch', path);
export const Delete = (path: RoutePath) => Route('delete', path);
export const Head = (path: RoutePath) => Route('head', path);
export const Options = (path: RoutePath) => Route('options', path);
