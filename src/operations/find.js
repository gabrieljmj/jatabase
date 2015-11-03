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
  return function (where, order) {
    let db = require(Model.file),
      collection = db[Model.collection];
    
    if (typeof where === 'object') {
      if (Model._validateFields(where)) {
        let result = [];
        order = order ? order : 'desc';

        if (!collection.length) {
          return false;
        }

        if (!utils.object.size(where)) {
          return Model.findAllSync(order);
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
            result.push(collection[equals[k]]);
          }
        }

        if (order == 'asc') {
          // Nothing
        } else if (order == 'desc') {
          result.reverse();
        }

        return result.length ? result : false;
      }
    }

    for (let k in collection) {
      if (collection.hasOwnProperty(k)) {

        if (collection[k].id === where) {
          return collection[k];
        }
      }
    }

    return false;
  }
};