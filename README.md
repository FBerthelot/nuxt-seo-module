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

### Add it to nuxt

Add it to your `nuxt.config.js` file.


```javascript
  /** ... **/
  modules: [
    /* ... */
    'nuxt-seo-module'
  ]
  /** ... **/
```

It will create a `robots.txt` file and a sitemap.xml with all of your pages

## Options

nuxt-seo-module is composed of 2 modules, the robots and the sitemap one. You can configure them individually :

```javascript
  /** ... **/
  modules: [
    /* ... */
    ['nuxt-seo-module', {
      robots: {
        // ROBOTS.TXT options
      },
      sitemap: [
        // sitemaps options is an array of object
      ]
    }]
  ]
  /** ... **/
```

### robots.txt options

```javascript
modules: [
  /* ... */
  ['nuxt-seo-module', {
    robots: {
      UserAgent: '',
      CrawlDelay: '',
      Disallow: '',
      Allow: '',
      Sitemap: ''
    }
  }]
```
Each parameters can be a string or an array.

If you add a sitemap entry in your robots.txt, generated sitemap will not be added to the robots.txt file.

### sitemap options

A complete example of sitemap options:

```javascript
modules: [
  /* ... */
  ['nuxt-seo-module', {
    sitemap: [{
      path: 'sitemap.xml',
      hostname: null,
      generate: true,
      exclude: [],
      routes: [
        {
          url: '/page/2',
          changefreq: 'daily',
          priority: 1,
          lastmodISO: '2017-06-30T13:30:00.000Z'
        },
        {
          url: '/page/1',
          changefreq: 'daily',
          priority: 0.3,
          lastmodISO: '2017-06-30T13:30:00.000Z',
          links: [
          { lang: 'en', url: 'http://test.com/page-1/', },
          { lang: 'fr', url: 'http://test.com/page-1/fr/', },
          androidLink: 'android-app://com.company.test/page-1/'
        ]
        }
      ],
      cacheTime: 1000 * 60 * 15
    }, {
      path: 'sitemap-news.xml',
      hostname: 'my-url.com',
      generate: false,
      routes: getNews().map(news => {
        return {
          url: imgPath,
          img: news.imgs.map(img => {
            return {
              url: 'http://test.com/img1.jpg',
              caption: 'An image',
              title: 'The Title of Image One',
              geoLocation: 'London, United Kingdom',
              license: 'https://creativecommons.org/licenses/by/4.0/'
            },
          }),
          video: news.videos.map(video => {
            return {
              thumbnail_loc: 'http://test.com/tmbn1.jpg',
              title: 'A video title',
              description: 'This is a video'
            };
          })
        };
      })
    }]
  }]
```

## nuxt env variable

You can also use env variable in `nuxt.config.js`:

```javascript
/** ... **/
modules: [
  /* ... */
 ['nuxt-seo-module'],
],
env: {
  robots: {},
  sitemap: [{
    generate: true
  }]
}
/** ... **/
```
