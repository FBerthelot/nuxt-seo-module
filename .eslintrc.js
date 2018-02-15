module.exports = {
  "root": true,
  "extends": "xo-space/esnext",
  "parserOptions": {
    "sourceType": "script"
  },
  "env": {
    "node": true,
    "mocha": true
  },
  "rules": {
    "strict": ["error", "safe"],
    "no-unused-expressions": 0
  }
}
