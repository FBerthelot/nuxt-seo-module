'use strict';

const sm = require('sitemap');
const isHTTPS = require('is-https');
const {promisify} = require('util');
const {hostname} = require('os');

exports.createSitemap = function (options, routes, req) {
  const sitemapConfig = {
    hostname: options.baseUrl || (req && `${isHTTPS(req) ? 'https' : 'http'}://${req.headers.host}`) || `http://${hostname()}`,
    urls: routes
      .filter((elem, index, arr) => arr.indexOf(elem) === index)
      .map(route => {
        return {
          ...route,
          url: route.chunkName ? route.path : route.url
        };
      })
      .filter(route => !route.url.match(/\/:.*/)),
    cacheTime: options.cacheTime || 0
  };

  // Create promisified instance and return
  const sitemap = sm.createSitemap(sitemapConfig);
  sitemap.toXML = promisify(sitemap.toXML);

  return sitemap;
};
