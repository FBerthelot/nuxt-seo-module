'use strict';

const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const {createSitemap} = require('./createSiteMap');

exports.writeFiles = (options, nuxtInstance) => {
  return Promise.all(
    options.sitemap.map(sitemapOpts => {
      const xmlGeneratePath = path.resolve(nuxtInstance.options.srcDir, path.join('static', sitemapOpts.path));

      // Ensure no generated file exists
      return unlink(xmlGeneratePath)
        .catch(() => null)
        .then(() => createSitemap(sitemapOpts, [...nuxtInstance.options.router.routes, ...sitemapOpts.routes]))
        .then(sitemap => sitemap.toXML())
        .then(xml => writeFile(xmlGeneratePath, xml))
        .then(() => {
          return sitemapOpts.path;
        });
    })
  );
};
