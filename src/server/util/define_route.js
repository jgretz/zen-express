import _ from 'lodash';
import urljoin from 'url-join';

const verbs = ['get','post','put','delete'];
const needsIdRoute = ['get','put','delete'];
const allowsFileUpload = ['post'];

export const ROUTES = 'ROUTES';

export const defineRoute = (app, router, route, url, upload) => {
  // store on the global state so we can access elsewhere
  let routes = app.get(ROUTES); {
    if (!routes) {
      routes = {};
      app.set(ROUTES, routes);
    }
  }
  routes[url] = route;

  // capture before / after hooks
  const before = route['before'];
  const after = route['after'];

  // add verbs
  _.forEach(verbs, (verb) => {
    if (!route[verb]) {
      return;
    }

    const handler = (req, res) => {
      if (before) {
        before(req, res, verb);
      }

      route[verb](req, res);

      if (after) {
        after(req, res, verb);
      }
    };

    // handle file upload (this needs to be before the json)
    if (upload && _.includes(allowsFileUpload, verb)) {
      upload.addRoute(router, verb, url, handler);
    }

    // default json handler
    router[verb](url, handler);

    // handle get /{id}
    if (_.includes(needsIdRoute, verb)) {
      router[verb](urljoin(url, ':id'), handler);
    }
  });
};
