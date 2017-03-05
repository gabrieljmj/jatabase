/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

/**
 * Transform all date fields in Date objects
 *
 * @param {Model}  Model
 * @param {Object} record
 *
 * @return {Object}
 */
module.exports = function (Model, record) {
  Object.keys(record).map(function (index) {
    if (index != '_id') {
      record[index] = Model.fields[index].type.toLowerCase() == 'date'
          ? new Date(record[index]) : record[index];
    }
  });

  return record;
};