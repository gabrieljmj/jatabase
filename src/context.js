/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var _json = require('./_json'),
  fs = require('fs'),
  validateFile = require('./file.validator');

let Context = function (file) {
  validateFile(file);

  this.file = file;
  this._json = new _json(file);
};

/**
 * Set the last insert ID of a collection
 *
 * @param {String}  from
 * @param {Integer} id
 */
Context.prototype.setLastInsertId = function (from, id) {
  let contextFromCollection = getContextFromCollection(this, from, true);
    contextFromCollection['last_insert_id'] = id;

  this._json.updateKey(from, contextFromCollection);
};

/**
 * Return the last ID of a collection
 *
 * @param {String} from
 *
 * @return {Integer}
 */
Context.prototype.lastInsertId = function (from) {
  let contextFromCollection = getContextFromCollection(this, from, true);

  return contextFromCollection.last_insert_id;
};

let getContextFromCollection = function (Context, from, create) {
  let context = require(Context.file);

  if (typeof context[from] == 'undefined') {
    if (!create) {
      throw Error('Context for ' + from + ' not found.');
    }

    context[from] = {last_insert_id: null};
  }

  return context[from];
};

module.exports = Context;