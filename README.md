# nuxt-seo-module

> Nuxt Module that generate sitemap, robot.txt and many things like that

[![Build Status](https://travis-ci.org/FBerthelot/nuxt-seo-module.svg?branch=master)](https://travis-ci.org/FBerthelot/nuxt-seo-module)
[![npm](https://img.shields.io/npm/dt/nuxt-seo-module.svg?style=flat-square)](https://npmjs.com/package/nuxt-seo-module)
[![npm (scoped with tag)](https://img.shields.io/npm/v/nuxt-seo-module/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-seo-module)

## Getting started

### Install

Install it via NPM:
``` bash
npm i nuxt-seo-module
```

or via yarn:
```bash
yarn add nuxt-seo-module
```

### Add to nuxt

Add it to your `nuxt.config.js` file.


```javascript
  /** ... **/
  modules: [
    /* ... */
    ['nuxt-seo-module', {
      robot: {
        UserAgent: 'Googlebot',
        Disallow: '/src/'
      },
      sitemap: {
        
      }
   }],
  ]
  /** ... **/
```

## Options

TODO

## nuxt env variable

You can also use env variable in `nuxt.config.js`:

```javascript
/** ... **/
modules: [
  /* ... */
 ['nuxt-cname-module'],
],
env: {
  baseUrl: 'myFunnyUrl.com'
}
/** ... **/
```
