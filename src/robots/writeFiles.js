'use strict';

const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const {create} = require('./createRobots');

exports.writeFiles = (options, nuxtInstance) => {
  const renderedRobots = create(options);

  const robotsTxtPath = path.resolve(nuxtInstance.options.srcDir, path.join('static', 'robots.txt'));

  return unlink(robotsTxtPath)
    .catch(() => null)
    .then(() => writeFile(robotsTxtPath, renderedRobots));
};
