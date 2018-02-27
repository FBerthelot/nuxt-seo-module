'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let robots;

const {registerMiddlewares} = proxyquire('./middleware', {
  './createRobots': {
    create(options, req) {
      expect(typeof options).to.equal('object');
      expect(typeof req).to.equal('object');
      return robots;
    }
  }
});

describe('robots - registerMiddlewares', () => {
  beforeEach(() => {
    robots = 'robots.txtContent';
  });

  it('should register one middleware for robots.txt path', () => {
    registerMiddlewares({}, {
      addServerMiddleware: midConfig => {
        expect(midConfig.path).to.equal('robots.txt');

        midConfig.handler({}, {
          setHeader: (headerType, value) => {
            expect(headerType).to.equal('Content-Type');
            expect(value).to.equal('text/plain');
          },
          end: content => {
            expect(content).to.equal('robots.txtContent');
          }
        });
      }
    });
  });
});
