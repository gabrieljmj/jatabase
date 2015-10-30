/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

module.exports = function (Model) {
  return function (where, opts) {
    if (Model._validateFields(where)) {
      opts = typeof opts === 'undefined' ? {} : opts;
      let db = require(Model.file),
        collection = db[Model.collection],
        result = [];

      if (!collection.length) {
        return false;
      }

      for (let k in collection) {
        let valids = [];

        for (let i in where) {
          if (where.hasOwnProperty(i)) {
            let curr = collection[k][i].toString(),
              r = opts['lowerCase'] ? curr.toLowerCase().search(where[i]) : curr.search(where[i]);
            valids.push(r + 1 ? true : false);
          }
        }

        if (utils.array.allValuesSame(valids, true)) {
          result.push(collection[k]);
        }
      }

      return result.length ? result : false;
    }
  }
};