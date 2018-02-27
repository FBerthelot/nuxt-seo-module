'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let writeRobotCalled;
let writeSitemapCalled;

const nuxtModule = proxyquire('./index', {
  './robots/index': {
    writeFiles: () => {
      writeRobotCalled = true;
    },
    registerMiddlewares: () => {}
  },
  './sitemap/index': {
    writeFiles: () => {
      writeSitemapCalled = true;
    },
    registerMiddlewares: () => {}
  }
});

describe('seo module', () => {
  let nuxt;

  beforeEach(() => {
    nuxt = {
      options: {
        robots: true,
        sitemap: true
      },
      nuxt: {
        hook: (_, cb) => {
          cb();
        }
      },
      nuxtModule
    };

    writeRobotCalled = false;
    writeSitemapCalled = false;
  });

  it('should not call witeFiles when it\'s dev mode', () => {
    nuxt.options.dev = true;
    nuxt.options.generate = false;

    nuxt.nuxtModule();
    expect(writeRobotCalled).to.be.false;
    expect(writeSitemapCalled).to.be.false;
  });

  it('should not call witeFiles when it\'s not generate mode', () => {
    nuxt.options.dev = false;
    nuxt.options.generate = false;

    nuxt.nuxtModule();
    expect(writeRobotCalled).to.be.false;
    expect(writeSitemapCalled).to.be.false;
  });

  it('should call witeFiles when it\'s  generate mode', () => {
    nuxt.options.dev = false;
    nuxt.options.generate = true;

    nuxt.nuxtModule();
    expect(writeRobotCalled).to.be.true;
    expect(writeSitemapCalled).to.be.true;
  });
});
