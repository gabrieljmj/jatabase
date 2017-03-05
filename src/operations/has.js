/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const utils = require('../utils'),
  whereClause = require('./clause/where');

module.exports = function (Model) {
  return function (where) {
    let db = require(Model.file),
      collection = db[Model.collection],
      _whereClause = whereClause(Model);
    where = typeof where == 'undefined' || where === null ? {} : where;
          
    if (typeof where == 'object') {
      if (Model._validateFields(where)) {
        if (!collection.length) {
          return false;
        }

        return !!_whereClause(where).length;
      }
    }

    for (let k in collection) {
      if (collection.hasOwnProperty(k)) {
        if (collection[k]._id == where) {
          return true;
        }
      }
    }

    return false;
  }
};