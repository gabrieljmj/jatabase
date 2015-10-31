/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var utils = require('../utils');

module.exports = function (Model) {
  return function (fields) {
    if (Model._validateFields(fields)) {
      let db = require(Model.file),
        collection = db[Model.collection],
        id = collection.length ? collection[collection.length - 1].id + 1 : 1;
      collection.push(utils.object.merge({id: id}, fields));
      Model._saveModificationOnKey(Model.collection, collection);

      return true;
    }

    return false;
  }
};