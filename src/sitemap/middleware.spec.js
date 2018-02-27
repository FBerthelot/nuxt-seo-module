'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let sitemap;

const {registerMiddlewares} = proxyquire('./middleware', {
  './createSiteMap': {
    createSitemap(options, routes, req) {
      expect(typeof options).to.equal('object');
      expect(typeof req).to.equal('object');
      expect(routes instanceof Array).to.equal(true);
      return {
        toXML: () => {
          return Promise.resolve(sitemap);
        }
      };
    }
  }
});

describe('sitemap - registerMiddlewares', () => {
  let options;
  beforeEach(() => {
    sitemap = 'sitemapContent';

    options = {
      sitemap: []
    };
  });

  it('should not add middleware when no sitemap config is available', () => {
    registerMiddlewares(options, {
      addServerMiddleware: () => {
        expect(true).to.equal('A middleware was added ??');
      }
    });
  });

  it('should register a middleware for the sitemap.xml path', () => {
    options.sitemap.push({path: 'sitemap.xml'});

    registerMiddlewares(options, {
      addServerMiddleware: midConfig => {
        expect(midConfig.path).to.equal('sitemap.xml');
      }
    });
  });

  it('should register a middleware for each entry in sitemap config', () => {
    options.sitemap.push({path: 'sitemap.xml'});
    options.sitemap.push({path: 'sitemap2.xml'});
    options.sitemap.push({path: 'sitemap3.xml'});

    let i = 0;
    registerMiddlewares(options, {
      addServerMiddleware: midConfig => {
        expect(midConfig.path).to.equal(options.sitemap[i].path);
        i++;
      }
    });
  });

  it('should register a middleware which return the sitemap', () => {
    options.sitemap.push({path: 'sitemap.xml', routes: []});

    registerMiddlewares(options, {
      addServerMiddleware: midConfig => {
        midConfig.handler({}, {
          setHeader: (headerType, value) => {
            expect(headerType).to.equal('Content-Type');
            expect(value).to.equal('application/xml');
          },
          end: content => {
            expect(content).to.equal('sitemapContent');
          }
        });
      },
      options: {router: {routes: []}}
    });
  });
});
