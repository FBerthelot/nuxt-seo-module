'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let robotModuleReturn;
let sitemapModuleReturn;
let robotModuleCalled;
let sitemapModuleCalled;

const nuxtModule = proxyquire('./index', {
  './robots/index': () => {
    robotModuleCalled = true;
    return robotModuleReturn;
  },
  './sitemap/index': () => {
    sitemapModuleCalled = true;
    return sitemapModuleReturn;
  }
});

xdescribe('seo module', () => {
  const baseOptions = {
    robot: {
      UserAgent: 'toto'
    },
    sitemap: {

    }
  };

  let nuxt;

  beforeEach(() => {
    nuxt = {
      options: baseOptions,
      nuxtModule
    };

    robotModuleReturn = Promise.resolve();
    sitemapModuleReturn = Promise.resolve();
    sitemapModuleCalled = false;
    robotModuleCalled = false;
  });

  it('should call robots and sitemap when options is active', () => {
    return nuxt.nuxtModule()
      .then(() => {
        expect(sitemapModuleCalled).to.be.true;
        expect(robotModuleCalled).to.be.true;
      });
  });

  it('should not call robots module when option is disable', () => {
    return nuxt.nuxtModule({
      robot: null
    })
      .then(() => {
        expect(sitemapModuleCalled).to.be.true;
        expect(robotModuleCalled).to.be.false;
      });
  });

  it('should not call seo module when option is disable', () => {
    return nuxt.nuxtModule({
      sitemap: null
    })
      .then(() => {
        expect(sitemapModuleCalled).to.be.false;
        expect(robotModuleCalled).to.be.true;
      });
  });

  it('should not call anything when all options is disable', () => {
    return nuxt.nuxtModule({
      sitemap: null,
      robot: null
    })
      .then(() => {
        expect(sitemapModuleCalled).to.be.false;
        expect(robotModuleCalled).to.be.false;
      });
  });
});
