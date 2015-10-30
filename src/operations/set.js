/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

module.exports = function (Model) {
  return function (data, where) {
    if (Model._validateFields(data) && Model._validateFields(where)) {
      let db = require(Model.file),
        collection = db[Model.collection],
        result = Model.findSync(where);

      for (let k in result) {
        if (result.hasOwnProperty(k)) {
          for (let i in data) {
            result[k][i] = data[i];
          }
        }
      }

      for (let k in collection) {
        if (collection.hasOwnProperty(k)) {
          for (let i in result) {
            if (result.hasOwnProperty(i)) {
              if (parseInt(collection[k].id) == parseInt(result[i].id)) {
                collection[k] = result[i];
              }
            }
          }
        }
      }

      Model._saveModificationOnKey(Model.collection, collection);
      return true
    }
  }
};