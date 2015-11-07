/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const utils = require('../utils'),
  filter = require('./filters/filters');

module.exports = function (Model) {
  return function (where, opts) {
    where = typeof where == 'undefined' || where === null ? {} : where;
    
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

        collection[k] = filter(Model, collection[k]);

        if (utils.array.allValuesSame(valids, true)) {
          result.push(collection[k]);
        }
      }

      return result.length ? result : false;
    }
  }
};