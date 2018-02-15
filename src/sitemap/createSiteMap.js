'use strict';

const sm = require('sitemap');
const isHTTPS = require('is-https');
const pify = require('pify');
const {hostname} = require('os');

exports.createSitemap = function (options, routes, req) {
  const sitemapConfig = {};

  // Set sitemap hostname
  sitemapConfig.hostname = options.hostname ||
    (req && `${isHTTPS(req) ? 'https' : 'http'}://${req.headers.host}`) || `http://${hostname()}`;

  // Set urls and ensure they are unique
  sitemapConfig.urls = routes.filter((elem, index, arr) => arr.indexOf(elem) === index);

  // Set cacheTime
  sitemapConfig.cacheTime = options.cacheTime || 0;

  // Create promisified instance and return
  const sitemap = sm.createSitemap(sitemapConfig);
  sitemap.toXML = pify(sitemap.toXML);

  return sitemap;
};
