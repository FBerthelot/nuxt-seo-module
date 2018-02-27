'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');

let isHttpsAnswer;
let hostnameAnswer;
const {createSitemap} = proxyquire('./createSiteMap', {
  'is-https': req => {
    expect(typeof req).to.equal('object');
    return isHttpsAnswer;
  },
  os: {
    hostname: () => hostnameAnswer
  },
  sitemap: {
    createSitemap: sitemapConfig => {
      expect(typeof sitemapConfig).to.equal('object');
      return {
        toXML: cb => cb(null, sitemapConfig)
      };
    }
  }
});

describe('createSitemap', () => {
  let options;
  let routes;
  let req;

  beforeEach(() => {
    isHttpsAnswer = false;
    hostnameAnswer = 'osHost.local';

    options = {};
    routes = [];
    req = {
      headers: {
        host: 'reqHost.com'
      }
    };
  });

  it('should create a sitemap object', () => {
    const sitemap = createSitemap(options, routes, req);

    expect(typeof sitemap).to.equal('object');
    expect(typeof sitemap.toXML).to.equal('function');

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.hostname).to.equal('http://reqHost.com');
        expect(sitemapConfig.urls).to.deep.equal([]);
        expect(sitemapConfig.cacheTime).to.equal(0);
      });
  });

  it('should set hostname with https when request is https', () => {
    isHttpsAnswer = true;
    const sitemap = createSitemap(options, routes, req);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.hostname).to.equal('https://reqHost.com');
      });
  });

  it('should set hostname with os when there is no request', () => {
    isHttpsAnswer = true;
    const sitemap = createSitemap(options, routes);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.hostname).to.equal('http://osHost.local');
      });
  });

  it('should set hostname with the baseUrl option', () => {
    options.baseUrl = 'https://overwritingHost.com';
    const sitemap = createSitemap(options, routes, req);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.hostname).to.equal('https://overwritingHost.com');
      });
  });

  it('should set cacheTime to 0 by default', () => {
    const sitemap = createSitemap(options, routes, req);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.cacheTime).to.equal(0);
      });
  });

  it('should set cacheTime to 69', () => {
    options.cacheTime = 69;
    const sitemap = createSitemap(options, routes, req);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.cacheTime).to.equal(69);
      });
  });

  it('should remove duplicate routes', () => {
    routes = ['toto', 'toto', {url: 'toto'}, 'toto'];
    const sitemap = createSitemap(options, routes, req);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.urls).to.deep.equal([{url: 'toto'}]);
      });
  });

  it('should remove duplicate routes with variables', () => {
    routes = ['/toto/:var', {url: '/:id'}, '/cool'];
    const sitemap = createSitemap(options, routes, req);

    return sitemap.toXML()
      .then(sitemapConfig => {
        expect(sitemapConfig.urls).to.deep.equal([{url: '/cool'}]);
      });
  });
});
