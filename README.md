jatabase
=========
![](https://img.shields.io/badge/status-development-red.svg) ![](https://img.shields.io/npm/v/jatabase.svg)

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

### Creating models
Create models with the method ```createModel```. This model will contain all persistence methods lide ```add``` and ```delete```.
```js
var Jatabase = require('jatabase'),
  jd = new Jatabase(__dirname + '/file.json'),
  models = {
    products: jd.createModel('products', {
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

### Add

#### Async way
```js
productsModel.add({name: 'Pear TV', price: 1280.00, categories: ['TV'], decription: 'Just a TV'}).then(function (success) {
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
productsModel.find(3).then(function (product) {
    // ...
});

// Using price
productsModel.find({price: 2400.00}).then(function (product) {
    // ...
});

// Find one
// Using ID
productsModel.findOne(3).then(function (product) {
    // ...
});

// Using price
productsModel.findOne({price: 2400.00}).then(function (product) {
    // ...
});

// Find all
productsModel.findAll().then(function (products) {
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
productsModel.delete(3).then(function (success) {
    // ...
});

// Using price
productsModel.delete({price: 2400.00}).then(function (success) {
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
productsModel.set({price: 2500.00}, 5).then(function (success) {
    // ...
});

// Using name
productsModel.set({price: 2500.00}, {name: 'Pear TV'}).then(function (success) {
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
productsModel.search({name: 'TV'}).then(function (products) {
    // ...
});

// Case sensitive off
productsModel.search({name: 'TV'}, {lowerCase: true}).then(function (products) {
    // ...
});
```

#### Sync way
```js
// Using 
var products = productsModel.search({name: 'TV'});

// Case sensitive off
var products = productsModel.search({name: 'TV'}, {lowerCase: true});
```

### Has method

#### Async way
```js
// Using ID
productsModel.has(5).then(function (has) {
    // ...
});

// Using another fields
productsModel.has({name: 'Pear TV'}).then(function (has) {
    // ...
});
```

#### Sync way
```js
// Using ID
productsModel.has(5);

// Using another fields
productsModel.has({name: 'Pear TV'});
```

# License
[MIT License](https://github.com/gabrieljmj/jatabase/blob/dev/LICENSE.md) 2015 © Gabriel Jacinto.