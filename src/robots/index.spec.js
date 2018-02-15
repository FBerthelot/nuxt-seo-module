'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let writeFileErr;
let unlinkErr;
let unlinkCalled;
let writeFileCalles;

const nuxtModule = proxyquire('./index', {
  fs: {
    writeFile(path, content, cb) {
      writeFileCalles = true;
      cb(writeFileErr, {path, content});
    },
    unlink(path, cb) {
      unlinkCalled = true;
      cb(unlinkErr, path);
    }
  }
});

describe('robots module', () => {
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

    options = {
      robot: {}
    };

    unlinkCalled = false;
    writeFileCalles = false;
    writeFileErr = null;
    unlinkErr = null;
  });

  it('should write a robots.txt file in generate mode', () => {
    return nuxtModule(options, nuxt)
      .then(({path}) => {
        expect(unlinkCalled).to.be.true;
        expect(writeFileCalles).to.be.true;
        expect(path).to.equal('/static/robots.txt');
      });
  });

  it('should not write a robots.txt file in dev mode', () => {
    nuxt.options.dev = true;
    return nuxtModule(options, nuxt)
      .then(() => {
        expect(unlinkCalled).to.be.false;
        expect(writeFileCalles).to.be.false;
      });
  });

  it('should not write a robots.txt file when it\'s not generate mode', () => {
    nuxt.options.dev = true;
    return nuxtModule(options, nuxt)
      .then(() => {
        expect(unlinkCalled).to.be.false;
        expect(writeFileCalles).to.be.false;
      });
  });

  it('should write add a middleware in for dev mode with robots.txt', () => {
    return nuxtModule(options, nuxt)
      .then(() => {
        expect(middlewareOpts.path).to.equal('robots.txt');
        middlewareOpts.handler(null, {
          setHeader: (headerType, value) => {
            expect(headerType).to.equal('Content-Type');
            expect(value).to.equal('text/plain');
          },
          end: content => {
            expect(content).to.equal('User-agent: *\nDisallow: ');
          }
        });
      });
  });

  it('should understand all entries of a robots.txt file ', () => {
    options.robot = {
      UserAgent: 'User-agent',
      CrawlDelay: 'Crawl-delay',
      Disallow: 'Disallow',
      Allow: '*',
      Sitemap: ['Sitemap.xml', 'sitemap2.xml']
    };
    return nuxtModule(options, nuxt)
      .then(({content}) => {
        expect(content).to.equal('User-agent: User-agent\nCrawl-delay: Crawl-delay\nDisallow: Disallow\nAllow: *\nSitemap: Sitemap.xml\nSitemap: sitemap2.xml');
      });
  });
});
