'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let writeFileErr;
let unlinkErr;
let unlinkCalled;
let writeFileCalled;

const nuxtModule = proxyquire('./index', {
  fs: {
    writeFile(path, content, cb) {
      writeFileCalled = true;
      cb(writeFileErr);
    },
    unlink(path, cb) {
      unlinkCalled = true;
      cb(unlinkErr);
    }
  },
  './getRoutes': {
    RouteGetter: class {
      get() {
        return Promise.resolve([]);
      }
    }
  },
  './createSitemap': {
    createSitemap: () => {
      return {
        toXML() {
          return Promise.resolve('yesItsXML!');
        }
      };
    }
  }
});

xdescribe('sitemap module', () => {
  let options;
  let nuxt;
  let middlewareOpts;

  beforeEach(() => {
    nuxt = {
      addServerMiddleware: opt => {
        middlewareOpts = opt;
      },
      options: {
        generate: true,
        dev: false,
        srcDir: '/'
      }
    };

    options = {};

    unlinkCalled = false;
    writeFileCalled = false;
    writeFileErr = null;
    unlinkErr = null;
  });

  it('should write a sitemap file in generate mode', () => {
    return nuxtModule(options, nuxt)
      .then(paths => {
        expect(unlinkCalled).to.be.true;
        expect(writeFileCalled).to.be.true;
        expect(paths).to.deep.equal(['sitemap.xml']);
      });
  });

  it('should not write a sitemap file in dev mode', () => {
    nuxt.options.dev = true;
    return nuxtModule(options, nuxt)
      .then(() => {
        expect(unlinkCalled).to.be.false;
        expect(writeFileCalled).to.be.false;
      });
  });

  it('should not write a sitemap file when it\'s not generate mode', () => {
    nuxt.options.generate = false;
    return nuxtModule(options, nuxt)
      .then(() => {
        expect(unlinkCalled).to.be.false;
        expect(writeFileCalled).to.be.false;
      });
  });

  it('should write add a middleware in for devthde with a sitemapGenerated', () => {
    return nuxtModule(options, nuxt)
      .then(() => {
        expect(middlewareOpts.path).to.equal('sitemap.xml');
        middlewareOpts.handler(null, {
          setHeader: (headerType, value) => {
            expect(headerType).to.equal('Content-Type');
            expect(value).to.equal('application/xml');
          },
          end: content => {
            expect(content).to.equal('yesItsXML!');
          }
        });
      });
  });
});
