import _ from 'lodash';
import loadFiles from '../util/load_files';
import defineRoute from './define_route';

export default (app, router, config) => {
  const routes = loadFiles([`${config.src}/routes`]);

  _.forEach(routes, (routeInfo) => {
    // set path name for the route
    let path = routeInfo.relativePath.replace('.js', '');
    if (path.includes('index')) {
      path = path.replace('index', '');
    }

    // attach the routes as defined
    const route = routeInfo.instance;
    const before = route['before'];
    const after = route['after'];

    defineRoute(router, route, path, before, after);
  });
};
