'use strict';

const {Minimatch} = require('minimatch');

function getFlatRoutes(routes = [], prefix = '') {
  return routes.reduce((flatRoutes, route) => {
    const childrenRoutes = getFlatRoutes(route.children, route.path);
    return [...flatRoutes, `${prefix}/${route.path}`, ...childrenRoutes];
  }, []);
}

function extractRoutes(routes, minimatchToExclude) {
  return getFlatRoutes(routes)
    .filter(route => !route.includes(':') && !route.includes('*'))
    .filter(route => {
      return !minimatchToExclude
        .reduce((isToExclude, minimatch) => {
          return isToExclude || minimatch.match(route);
        }, false);
    });
}

exports.RouteGetter = class routeGetter {
  constructor() {
    this.routes = [];
  }

  get(nuxtInstance, options) {
    return new Promise(resolve => {
      const now = new Date();
      const cacheExpirationDate = this.lastGeneratedDate ?
        new Date(this.lastGeneratedDate + options.cacheTime) :
        new Date(now - 1);

      if (cacheExpirationDate > now) {
        return resolve(this.routes);
      }

      const minimatchToExclude = options.exclude.map(pattern => {
        const minimatch = new Minimatch(pattern);
        minimatch.negate = true;
        return minimatch;
      });

      const extendRoutes = nuxtInstance.extendRoutes.bind(nuxtInstance);

      if (nuxtInstance.options.router.routes.length !== 0) {
        this.routes = extractRoutes(nuxtInstance.options.router.routes, minimatchToExclude);
        return resolve(this.routes);
      }

      let resolved = false;

      extendRoutes(function (routes) {
        this.lastGeneratedDate = now;
        this.routes = extractRoutes(routes, minimatchToExclude);
        !resolved && resolve(this.routes);
        return routes;
      });

      setTimeout(() => {
        resolved = true;
        resolve(nuxtInstance.options.router.routes);
      }, 1500);
    });
  }
};
