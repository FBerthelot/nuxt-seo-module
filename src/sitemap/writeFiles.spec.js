'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let writeFileErr;
let unlinkErr;
let sitemap;
let writePaths;
const {writeFiles} = proxyquire('./writeFiles', {
  fs: {
    writeFile(path, content, cb) {
      expect(typeof path).to.equal('string');
      expect(typeof content).to.equal('string');
      writePaths.push(path);
      cb(writeFileErr);
    },
    unlink(path, cb) {
      expect(typeof path).to.equal('string');
      cb(unlinkErr);
    }
  },
  './createSiteMap': {
    createSitemap(options, routes) {
      expect(typeof options).to.equal('object');
      expect(routes instanceof Array).to.equal(true);
      return {
        toXML: () => {
          return Promise.resolve(sitemap);
        }
      };
    }
  }
});

describe('robots - writeFile', () => {
  let options;
  let nuxtInstance;

  beforeEach(() => {
    sitemap = 'sitemapContent';

    options = {
      sitemap: []
    };

    nuxtInstance = {
      options: {
        srcDir: '/toto',
        router: {
          routes: []
        }
      }
    };

    writeFileErr = null;
    unlinkErr = null;
    writePaths = [];
  });

  it('should write a sitemap file in static directory', () => {
    options.sitemap.push({
      path: 'sitemap.xml',
      routes: []
    });

    return writeFiles(options, nuxtInstance)
      .then(() => {
        expect(writePaths[0]).to.equal('/toto/static/sitemap.xml');
      });
  });

  it('should write multiple sitemap file in static directory', () => {
    options.sitemap.push({
      path: 'sitemap.xml',
      routes: []
    });
    options.sitemap.push({
      path: 'sitemap2.xml',
      routes: []
    });
    options.sitemap.push({
      path: 'sitemap3.xml',
      routes: []
    });

    return writeFiles(options, nuxtInstance)
      .then(() => {
        expect(writePaths[0]).to.equal('/toto/static/sitemap.xml');
        expect(writePaths[1]).to.equal('/toto/static/sitemap2.xml');
        expect(writePaths[2]).to.equal('/toto/static/sitemap3.xml');
      });
  });

  it('should not care of unlink error', () => {
    unlinkErr = new Error('bouh');
    options.sitemap.push({
      path: 'sitemap.xml',
      routes: []
    });

    return writeFiles(options, nuxtInstance)
      .then(() => {
        expect(writePaths[0]).to.equal('/toto/static/sitemap.xml');
      });
  });

  it('should reject the promise when there is an error with fs.writeFile', () => {
    writePaths = new Error('bouh');
    options.sitemap.push({
      path: 'sitemap.xml',
      routes: []
    });

    return writeFiles(options, nuxtInstance)
      .then(() => {
        expect(false).to.equal(true);
      })
      .catch(() => expect(true).to.equal(true));
  });
});
