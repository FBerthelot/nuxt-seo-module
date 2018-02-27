'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let isHttpsAnswer;
let hostnameAnswer;
const {create} = proxyquire('./createRobots', {
  'is-https': req => {
    expect(typeof req).to.equal('object');
    return isHttpsAnswer;
  },
  os: {
    hostname: () => hostnameAnswer
  }
});

describe('createRobots', () => {
  beforeEach(() => {
    isHttpsAnswer = null;
    hostnameAnswer = 'osHostName';
  });

  it('should understand all entries of a robots.txt file', () => {
    const robot = create({
      robots: {
        UserAgent: 'User-agent',
        CrawlDelay: 'Crawl-delay',
        Disallow: 'Disallow',
        Allow: '*',
        Sitemap: 'https://toto.com/Sitemap.xml'
      }
    });

    expect(robot).to.equal('User-agent: User-agent\nCrawl-delay: Crawl-delay\nDisallow: Disallow\nAllow: *\nSitemap: https://toto.com/Sitemap.xml');
  });

  it('should add multiple line when values are array', () => {
    const robot = create({
      robots: {
        UserAgent: ['User-agent', 'User-agent2'],
        CrawlDelay: ['Crawl-delay', 'Crawl-delay2'],
        Disallow: ['Disallow', 'Disallow3'],
        Allow: ['*', '*2'],
        Sitemap: ['http://toto.com/Sitemap.xml', 'https://toto.com/sitemap2.xml']
      }
    });

    expect(robot).to.equal('User-agent: User-agent\nUser-agent: User-agent2\nCrawl-delay: Crawl-delay\nCrawl-delay: Crawl-delay2\nDisallow: Disallow\nDisallow: Disallow3\nAllow: *\nAllow: *2\nSitemap: http://toto.com/Sitemap.xml\nSitemap: https://toto.com/sitemap2.xml');
  });

  it('should prefix sitemap entry with the baseUrl', () => {
    const robot = create({
      robots: {
        Sitemap: ['Sitemap.xml', 'https://tata.com/sitemap2.xml']
      },
      baseUrl: 'http://toto.com'
    });

    expect(robot).to.equal('Sitemap: http://toto.com/Sitemap.xml\nSitemap: https://tata.com/sitemap2.xml');
  });

  it('should prefix sitemap entry with the baseUrl', () => {
    const robot = create({
      robots: {
        Sitemap: ['Sitemap.xml', 'https://tata.com/sitemap2.xml']
      },
      baseUrl: 'http://toto.com'
    });

    expect(robot).to.equal('Sitemap: http://toto.com/Sitemap.xml\nSitemap: https://tata.com/sitemap2.xml');
  });

  it('should prefix sitemap entry with the req hostname in https', () => {
    isHttpsAnswer = true;
    const robot = create({
      robots: {
        Sitemap: ['Sitemap.xml', 'https://tata.com/sitemap2.xml']
      }
    }, {
      headers: {
        host: 'reqHostname.com'
      }
    });

    expect(robot).to.equal('Sitemap: https://reqHostname.com/Sitemap.xml\nSitemap: https://tata.com/sitemap2.xml');
  });

  it('should prefix sitemap entry with the req hostname in http', () => {
    isHttpsAnswer = false;
    const robot = create({
      robots: {
        Sitemap: ['Sitemap.xml', 'https://tata.com/sitemap2.xml']
      }
    }, {
      headers: {
        host: 'reqHostname.com'
      }
    });

    expect(robot).to.equal('Sitemap: http://reqHostname.com/Sitemap.xml\nSitemap: https://tata.com/sitemap2.xml');
  });

  it('should prefix sitemap entry with the os hostname', () => {
    const robot = create({
      robots: {
        Sitemap: ['Sitemap.xml', 'https://tata.com/sitemap2.xml']
      }
    });

    expect(robot).to.equal('Sitemap: http://osHostName/Sitemap.xml\nSitemap: https://tata.com/sitemap2.xml');
  });
});
