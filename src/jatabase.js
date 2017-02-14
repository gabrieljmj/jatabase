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

const Jatabase = function (file) {
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
Jatabase.prototype.createModel = function (collection, fields) {
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

  try {
    require(contextFile);
  } catch (e) {
    let obj = {};
    obj[model] = {};
    fs.writeFileSync(contextFile, JSON.stringify(obj));
  }

  return new Context(contextFile);
};

module.exports = Jatabase;