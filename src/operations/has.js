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
    if (Model._validateFields(where)) {
      let db = require(Model.file),
        collection = db[Model.collection];

      if (!collection.length) {
        return false;
      }

      let equals = [];

      for (let k in collection) {
        let e = [];

        for (let i in where) {
          if (where.hasOwnProperty(i)) {
            e.push(collection[k][i] == where[i] ? true : false);
          }
        }

        equals.push(e);
      }

      for (let k in equals) {
        if (utils.array.allValuesSame(equals[k], true)) {
          return true;
        }
      }

      return false;
    }
  }
};