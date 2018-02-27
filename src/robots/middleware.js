'use strict';

const {create} = require('./createRobots');

exports.registerMiddlewares = (options, nuxtInstance) => {
  return nuxtInstance.addServerMiddleware({
    path: 'robots.txt',
    handler(req, res) {
      const renderedRobots = create(options, req);

      res.setHeader('Content-Type', 'text/plain');
      res.end(renderedRobots);
    }
  });
};
