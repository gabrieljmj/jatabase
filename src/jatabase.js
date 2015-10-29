/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var model = require('./model');

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
  var newModel = function (db, collection) {
    this.file = db;
    this.collection = collection;
    this.fields = fields;
  };

  newModel.prototype = new model;

  return new newModel(this.file, collection);
};

module.exports = jatabase;