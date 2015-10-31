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
  return function (where) {
    let db = require(Model.file),
      collection = db[Model.collection];

    if (typeof where == 'object') {
      if (!utils.object.size(where)) {
        collection = [];
      } else {
        if (Model._validateFields(where)) {
          if (!collection.length) {
            return false;
          }

          let equals = [];

          for (let k in collection) {
            if (collection.hasOwnProperty(k)) {
              if (utils.object.propertiesEqualsTo(collection[k], where)) {
                equals.push(k);
              }
            }
          }

          for (let k in equals) {
            if (equals.hasOwnProperty(k)) {
              collection.splice(equals[k], 1);
            }
          }
        }
      }
    } else {
      let index;
      
      for (let k in collection) {
        if (collection[k].id == where) {
          index = k;
        }
      }

      if (typeof index === 'undefined') {
        return false;
      }

      collection.splice(index, 1);

      return true;
    }

    Model._saveModificationOnKey(Model.collection, collection);
  }
};