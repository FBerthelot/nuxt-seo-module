'use strict';

const expect = require('chai').expect;
const sitemap = require('./index');

describe('robots module', () => {
  it('should export writeFiles method', () => {
    expect(typeof sitemap.writeFiles).to.equal('function');
  });

  it('should export registerMiddlewares method', () => {
    expect(typeof sitemap.registerMiddlewares).to.equal('function');
  });

  it('should export only 2 methods', () => {
    expect(Object.keys(sitemap).length).to.equal(2);
  });
});
