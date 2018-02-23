'use strict';

const {createSitemap} = require('./createSiteMap');

exports.registerMiddlewares = (options, nuxtInstance) => {
  options.sitemap.map(sitemapOpts => {
    return nuxtInstance.addServerMiddleware({
      path: sitemapOpts.path,
      handler(req, res, next) {
        createSitemap(sitemapOpts, [...nuxtInstance.options.router.routes, ...sitemapOpts.routes], req).toXML()
          .then(xml => {
            res.setHeader('Content-Type', 'application/xml');
            res.end(xml);
          })
          .catch(err => next(err));
      }
    });
  });
};
