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
      if (!utils.object.size(where)) {
        collection = [];
      } else {
        if (Model._validateFields(where)) {
          if (!collection.length) {
            return false;
          }

          let toDelete = _whereClause(where).map(function (record, key) {
            return key;
          }),
            newCollection = [];

          for (let k in collection) {
            if (collection.hasOwnProperty(k)) {
              if (!utils.array.contains(toDelete, k)) {
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
        if (collection[k]._id == where) {
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