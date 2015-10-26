/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

var model = require('./model');

var jatabase = function (file) {
  this.file = file;
};

/**
 * Create a new model using jatabase model
 *
 * @param {string} name
 * @param {Array}  fields
 *
 * @return {Model}
 */
jatabase.prototype.createModel = function (name, fields) {
  var newModel = function (db, name) {
    this.file = db;
    this.name = name;
    this.fields = fields;
  };

  newModel.prototype = new model;

  return new newModel(this.file, name);
};

module.exports = jatabase;