jatabase
=========
![](https://img.shields.io/badge/status-development-red.svg) ![](https://img.shields.io/npm/v/jatabase.svg) [![Build Status](https://travis-ci.org/gabrieljmj/jatabase.svg?branch=dev)](https://travis-ci.org/gabrieljmj/jatabase)

This is advisable when you need a local simple database without any security -- is a JSON file. **jatabase** was created for a desktop application using [electron](http://electron.atom.io/), so, is also ideal for desktop application.

## Installing
```console
$ npm install jatabase --save
```

![](https://nodei.co/npm/jatabase.png?downloads=true&downloadRank=true&stars=true)

## Usage
All the persistence methods use promises, so they have an async way of using and a sync way.

* [Creating models](#creating-models) 
* [Field types](#field-types)
* [Add](#add)
* [Find/Find one/Find all](#findfind-onefind-all)
* [Delete](#delete)
* [Update](#update)
* [Search](#search)
* [Has method](#has-method)
* [Associations](#associations)

### Creating models
Create models with the method ```createModel```. This model will contain all persistence methods like ```add``` and ```delete```.

```js
const Jatabase = require('jatabase'),
  jb = new Jatabase(__dirname + '/file.json'),
  models = {
    products: jb.createModel('products', {
      name: {
        type: 'string'
      },
      price: {
        type: 'number'
      },
      categories: {
        type: 'array'
      },
      description: {
        type: 'string'
      },
      created_at: {
        type: 'date'
      }
    })
  };

module.exports = models;
```

### Field types
* ```string```
* ```number```
* ```array```
* ```object```
* ```date``` Returns a Date object

### Add

#### Async way
```js
productsModel.add({name: 'Pear TV', price: 1280.00, categories: ['TV'], decription: 'Just a TV', created_at: new Date()}).then(success => {
    // ...
});
```

#### Sync way
```js
productsModel.addSync({name: 'Pear TV', price: 2400.00, categories: ['TV'], decription: 'Just a TV'});
```

### Find/Find one/Find all

#### Async way
```js
// Using ID
productsModel.find(3).then(product => {
    // ...
});

// Using price
productsModel.find({price: 2400.00}).then(product => {
    // ...
});

// Find one
// Using ID
productsModel.findOne(3).then(product => {
    // ...
});

// Using price
productsModel.findOne({price: 2400.00}).then(product => {
    // ...
});

// Find all
productsModel.findAll().then(products => {
    // ...
});
```

#### Sync way
```js
// Using ID
var product = productsModel.findSync(3);

// Using price
var product = productsModel.findSync({price: 2400.00});

// Find one
// Using ID
var product = productsModel.findOneSync(3);

// Using price
var product = productsModel.findOneSync({price: 2400.00});

// Find all
var products = productsModel.findAllSync();
```

### Delete

#### Async way
```js
// Using ID
productsModel.delete(3).then(success => {
    // ...
});

// Using price
productsModel.delete({price: 2400.00}).then(success => {
    // ...
});
```

#### Sync way
```js
// Using ID
productsModel.deleteSync(3);

// Using price
productsModel.deleteSync({price: 2400.00});
```

### Update

#### Async way
```js
// Using ID
productsModel.set({price: 2500.00}, 5).then(success => {
    // ...
});

// Using name
productsModel.set({price: 2500.00}, {name: 'Pear TV'}).then(success => {
    // ...
});
```

#### Sync way
```js
// Using ID
productsModel.setSync({price: 2500.00}, 5);

// Using name
productsModel.setSync({price: 2500.00}, {name: 'Pear TV'});
```

### Search

#### Async way
```js
// Using 
productsModel.search({name: 'TV'}).then(products => {
    // ...
});

// Case sensitive off
productsModel.search({name: 'TV'}, {lowerCase: true}).then(products => {
    // ...
});
```

#### Sync way
```js
// Using 
var products = productsModel.searchSync({name: 'TV'});

// Case sensitive off
var products = productsModel.searchSync({name: 'TV'}, {lowerCase: true});
```

### Has method

#### Async way
```js
// Using ID
productsModel.has(5).then(has => {
    // ...
});

// Using another fields
productsModel.has({name: 'Pear TV'}).then(has => {
    // ...
});
```

#### Sync way
```js
// Using ID
productsModel.hasSync(5);

// Using another fields
productsModel.hasSync({name: 'Pear TV'});
```

### Associations
Fields can be represented by another collections. There are two kinds of associations: by foreign id or array of foreign ids.
This way, on a consult, all the ids will be transformed to objects.

```js
const usersLevelsModel = jb.createModel('users_levels', {
    name: {type: 'string'}
  }),
  usersModel = jb.createModel('users', {
    name: {type: 'string'},
    level: {
      type: 'number',
      associatedTo: 'users_levels'
    }
  });
```

# License
[MIT License](https://github.com/gabrieljmj/jatabase/blob/dev/LICENSE.md) 2017 © Gabriel Jacinto.