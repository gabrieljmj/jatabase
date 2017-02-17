/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const utils = require('../utils');

module.exports = function (Model) {
  return function (fields) {
    if (Model._validateFields(fields)) {
      let db = require(Model.file),
        collection = db[Model.collection],
        context = Model.context,
        id;

      if (context.lastInsertId(Model.collection) == null) {
        id = collection.length ? collection[collection.length - 1].id + 1 : 1;
      } else {
        id = collection.length ? context.lastInsertId(Model.collection) + 1 : 1;
      }
    
      context.setLastInsertId(Model.collection, id);

      collection.push(utils.object.merge({id: id}, fields));
      Model._saveModificationOnKey(Model.collection, collection);
    }
  }
};