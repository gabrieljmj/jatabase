/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const model = require('./model'),
  fs = require('fs'),
  path = require('path'),
  Context = require('./context');

var jatabase = function (file) {
  this.file = file;
};

/**
 * Create a new model using jatabase model
 *
 * @param {string} collection
 * @param {Object} fields
 *
 * @return {Model}
 */
jatabase.prototype.createModel = function (collection, fields) {
  let newModel = function (db, collection, _fields, context) {
    this.file = db;
    this.collection = collection;
    this.fields = _fields;
    this.context = context;
  };

  newModel.prototype = new model;

  return new newModel(this.file, collection, fields, createContext(this.file, collection));
};

let createContext = function (file, model) {
    let dir = path.dirname(file),
      fileName = path.basename(file, '.json'),
      contextFile = dir + '/.' + fileName + '.context.json';

    fs.stat(contextFile, function(err, stat) {
      if (err != null && err.code == 'ENOENT') {
        let obj = {};
        obj[model] = [];
        fs.writeFile(contextFile, JSON.stringify(obj), function (err) {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    return new Context(contextFile);
};

module.exports = jatabase;