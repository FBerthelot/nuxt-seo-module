'use strict';

const expect = require('chai').expect;
const robots = require('./index');

describe('robots module', () => {
  it('should export writeFiles method', () => {
    expect(typeof robots.writeFiles).to.equal('function');
  });

  it('should export registerMiddlewares method', () => {
    expect(typeof robots.registerMiddlewares).to.equal('function');
  });

  it('should export only 2 methods', () => {
    expect(Object.keys(robots).length).to.equal(2);
  });
});
