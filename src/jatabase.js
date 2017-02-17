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

const createContext = function (file, model) {
  let dir = path.dirname(file),
    fileName = path.basename(file, '.json'),
    contextFile = dir + '/.' + fileName + '.context.json';

  try {
    require(contextFile);
  } catch (e) {
    let obj = {};
    obj[model] = {};
    fs.writeFileSync(contextFile, JSON.stringify(obj));
  }

  return new Context(contextFile);
};

const Jatabase = function (file) {
  this.file = file;
  this.models = {};
};

/**
 * Create a new model using jatabase model
 *
 * @param {string} collection
 * @param {Object} fields
 *
 * @return {Model}
 */
Jatabase.prototype.createModel = function (collection, fields) {
  let models = this.models;
  
  const newModel = function (db, collection, _fields, context) {
    Object.keys(_fields).forEach(function (index) {
      let field = _fields[index];

      if (!!field.associatedTo) {
        field.model = models[field.associatedTo];
        _fields[index] = field;
      }
    });

    this.file = db;
    this.collection = collection;
    this.fields = _fields;
    this.context = context;
  };

  newModel.prototype = new model;

  this.models[collection] = new newModel(this.file, collection, fields, createContext(this.file, collection));

  return this.models[collection];
};

module.exports = Jatabase;