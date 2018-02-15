/*
	Many thanks to WilliamDASILVA for nuxt-robot-module

	https://github.com/WilliamDASILVA/nuxt-robots-module
*/
'use strict';

const robotModule = require('./robots/index');
const sitemapModule = require('./sitemap/index');

module.exports = function (moduleOptions) {
  const options = {
    ...this.options,
    ...moduleOptions
  };

  return Promise.resolve()
    .then(() => {
      options.sitemap && sitemapModule(options, this);
    })
    .then(Sitemap => {
      options.robot = options.robot ? {
        ...options.robots,
        Sitemap
      } : null;
      return options.robot && robotModule(options, this);
    });
};
