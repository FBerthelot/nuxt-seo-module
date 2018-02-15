/*
	Many thanks to WilliamDASILVA for nuxt-robot-module

	https://github.com/WilliamDASILVA/nuxt-robots-module
*/
'use strict';

const fs = require('fs');
const {promisify} = require('util');
const path = require('path');

const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const correspondances = {
  UserAgent: 'User-agent',
  CrawlDelay: 'Crawl-delay',
  Disallow: 'Disallow',
  Allow: 'Allow',
  Sitemap: 'Sitemap'
};

function render(robots) {
  const r = (robots instanceof Array) ? robots : [robots];
  return r.map(robot => {
    let rules = [];
    Object.keys(correspondances).forEach(k => {
      let arr = [];
      if (typeof robot[k] !== 'undefined') {
        if (robot[k] instanceof Array) {
          arr = robot[k].map(value => `${correspondances[k]}: ${value}`);
        } else {
          arr.push(`${correspondances[k]}: ${robot[k]}`);
        }
      }

      rules = rules.concat(arr);
    });

    return rules.join('\n');
  }).join('\n');
}

module.exports = function (moduleOptions, nuxtInstance) {
  const options = {
    UserAgent: '*',
    Disallow: '',
    ...moduleOptions.robot
  };

  const renderedRobots = render(options);

  nuxtInstance.addServerMiddleware({
    path: 'robots.txt',
    handler(req, res) {
      res.setHeader('Content-Type', 'text/plain');
      res.end(renderedRobots);
    }
  });

  // Robots.txt is written to static dir on generate mode
  if (!nuxtInstance.options.dev && nuxtInstance.options.generate) {
    const robotsTxtPath = path.resolve(nuxtInstance.options.srcDir, path.join('static', 'robots.txt'));
    return unlink(robotsTxtPath)
      .then(() => writeFile(robotsTxtPath, renderedRobots));
  }

  return Promise.resolve();
};
