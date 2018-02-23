'use strict';

const debug = require('debug')('nuxt:seo');
const sitemap = require('./sitemap/index');
const robots = require('./robots/index');

module.exports = function (moduleOptions) {
  const options = {
    ...this.options,
    ...moduleOptions,
    sitemap: [
      ...(
        moduleOptions.sitemap === true ?
          [{
            path: 'sitemap.xml',
            hostname: null,
            generate: true,
            exclude: [],
            routes: [],
            cacheTime: 1000 * 60 * 15
          }] :
          moduleOptions.sitemap.map(sitemap => {
            return {
              path: 'sitemap.xml',
              hostname: null,
              generate: true,
              exclude: [],
              routes: [],
              cacheTime: 1000 * 60 * 15,
              ...sitemap
            };
          })
      )
    ],
    robots: {
      UserAgent: '*',
      Disallow: '',
      ...this.options.robots,
      ...moduleOptions.robots
    }
  };

  // Add generated sitemap into robots.txt
  if (options.sitemap && options.robots && !options.noGeneratedSitemapInRobotsTxT) {
    options.robots.Sitemap = [
      ...(options.robots.sitemap || []),
      ...options.sitemap.map(sm => sm.path)
    ];
  }

  // Register middlewares
  options.sitemap && sitemap.registerMiddlewares(options, this);
  options.robots && robots.registerMiddlewares(options, this);
  debug('Middlewares registered');

  // Stop there if it's not generate mode
  if (options.dev || !options.generate) {
    return;
  }

  options.sitemap && debug('Starting generate sitemap files');
  options.robots && debug('Starting generate robots.txt');

  this.nuxt.hook('build:compile', () => {
    return Promise.all([
      options.sitemap && sitemap.writeFiles(options, this),
      options.robots && robots.writeFiles(options, this)
    ])
      .then(() => {
        options.sitemap && debug('Finishing generate sitemap files');
        options.robots && debug('Finishing generate robots.txt');
      });
  });
};
