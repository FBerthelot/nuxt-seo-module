'use strict';

const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const {RouteGetter} = require('./getRoutes');
const {createSitemap} = require('./createSitemap');

module.exports = function (moduleOptions, nuxtInstance) {
  const options = {
    sitemap: [
      {
        path: 'sitemap.xml',
        hostname: null,
        generate: true,
        exclude: [],
        routes: [],
        cacheTime: 1000 * 60 * 15
      }
    ],
    ...nuxtInstance.options.sitemap,
    ...moduleOptions
  };

  return Promise.all(
    options.sitemap.map(sitemapOpts => {
      const routeGetter = new RouteGetter();

      // Add server middleware
      nuxtInstance.addServerMiddleware({
        path: sitemapOpts.path,
        handler(req, res, next) {
          routeGetter.get(nuxtInstance, sitemapOpts)
            .then(routes => createSitemap(sitemapOpts, routes, req).toXML())
            .then(xml => {
              res.setHeader('Content-Type', 'application/xml');
              res.end(xml);
            })
            .catch(err => next(err));
        }
      });

      return routeGetter.get(nuxtInstance, sitemapOpts)
        .then(routes => {
          // Sitemap.xml is written to static dir on generate mode
          if (nuxtInstance.options.dev || !nuxtInstance.options.generate) {
            return sitemapOpts.path;
          }
          // Ensure no generated file exists
          const xmlGeneratePath = path.resolve(nuxtInstance.options.srcDir, path.join('static', sitemapOpts.path));
          return unlink(xmlGeneratePath)
            .then(() => createSitemap(sitemapOpts, routes))
            .then(sitemap => sitemap.toXML())
            .then(xml => writeFile(xmlGeneratePath, xml))
            .then(() => sitemapOpts.path);
        });
    })
  );
};
