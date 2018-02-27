'use strict';

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

let writeFileErr;
let unlinkErr;
let robots;
let expectedWritePath;
const {writeFiles} = proxyquire('./writeFiles', {
  fs: {
    writeFile(path, content, cb) {
      expect(typeof path).to.equal('string');
      expect(typeof content).to.equal('string');
      expect(path).to.equal(expectedWritePath);
      cb(writeFileErr);
    },
    unlink(path, cb) {
      expect(typeof path).to.equal('string');
      cb(unlinkErr);
    }
  },
  './createRobots': {
    create(options) {
      expect(typeof options).to.equal('object');
      return robots;
    }
  }
});

describe('robots - writeFile', () => {
  let options;
  let nuxtInstance;

  beforeEach(() => {
    robots = 'robot.txtContent';

    options = {
      robot: {}
    };

    nuxtInstance = {
      options: {
        srcDir: '/toto'
      }
    };

    writeFileErr = null;
    unlinkErr = null;
    expectedWritePath = '';
  });

  it('should write a robots.txt file in static directory', () => {
    expectedWritePath = '/toto/static/robots.txt';

    return writeFiles(options, nuxtInstance);
  });

  it('should reject the Promise when write throw an error', () => {
    expectedWritePath = '/toto/static/robots.txt';
    writeFileErr = new Error('bouh');

    return writeFiles(options, nuxtInstance)
      .then(() => expect(true).to.equal(false))
      .catch(() => expect(true).to.equal(true));
  });

  it('should not care about unlink error', () => {
    expectedWritePath = '/toto/static/robots.txt';
    unlinkErr = new Error('bouh');

    return writeFiles(options, nuxtInstance);
  });
});
