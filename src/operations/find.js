/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const utils = require('../utils'),
  filter = require('./filters/filters'),
  whereClause = require('./clause/where');

module.exports = function (Model) {
  return function (where, order) {
    let db = require(Model.file),
      collection = db[Model.collection],
      _whereClause = whereClause(Model);
    where = typeof where == 'undefined' || where === null ? {} : where;

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

        result = _whereClause(where);

        if (order == 'asc') {
          // Nothing
        } else if (order == 'desc') {
          result.reverse();
        }

        for (let k = 0, len = result.length; k < len; k++) {
          result[k] = filter(Model, result[k]);
        }

        return result.length ? result : false;
      }
    }

    for (let k = 0, len = collection.length; k < len; k++) {
      if (collection[k]._id === where) {
        collection[k] = filter(Model, collection[k]);

        return collection[k];
      }
    }

    return false;
  }
};