'use strict';

const isHTTPS = require('is-https');
const {hostname} = require('os');

const mapping = {
  UserAgent: 'User-agent',
  CrawlDelay: 'Crawl-delay',
  Disallow: 'Disallow',
  Allow: 'Allow',
  Sitemap: 'Sitemap'
};

const absoluteUrl = /^(http|https):\/\//;

exports.create = (options, req) => {
  const baseUrl = options.baseUrl || (req && `${isHTTPS(req) ? 'https' : 'http'}://${req.headers.host}`) || `http://${hostname()}`;

  const formattedRobots = {
    ...options.robots,
    Sitemap: options.robots.Sitemap instanceof Array ?
      options.robots.Sitemap.map(url => {
        if (url.match(absoluteUrl)) {
          return url;
        }
        return `${baseUrl}/${url}`;
      }) :
      options.robots.Sitemap ?
        options.robots.Sitemap.match(absoluteUrl) ? options.robots.Sitemap : `${baseUrl}/${options.robots.Sitemap}` :
        null
  };

  return Object.keys(mapping)
    .reduce((finalRobots, key) => {
      if (options.robots[key] === null || options.robots[key] === undefined) {
        return finalRobots;
      }

      const lineToAdd = formattedRobots[key] instanceof Array ?
        formattedRobots[key].map(value => `${mapping[key]}: ${value}`) :
        [`${mapping[key]}: ${formattedRobots[key]}`];

      return [...finalRobots, ...lineToAdd];
    }, [])
    .join('\n');
};
