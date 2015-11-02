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

          let newCollection = [];

          for (let k in collection) {
            if (collection.hasOwnProperty(k)) {
              if (!utils.array.contains(equals, k)) {
                newCollection.push(collection[k]);
              }
            }
          }

          collection = newCollection;
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
        throw new Error('Record with ID "' + where + '" was not found');
      }

      collection.splice(index, 1);
    }

    Model._saveModificationOnKey(Model.collection, collection);
  }
};