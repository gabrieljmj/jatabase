/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

/**
 * Create associations between models by it ids
 *
 * @param {Model}  Model
 * @param {Object} record
 *
 * @return {Object}
 */
module.exports = function(Model, record) {
  Object.keys(record).map(function (index) {
    if (index != '_id') {
      let field = Model.fields[index];

      if (!!field.associatedTo) {
        if (field.type === 'number') {
          record[index] = field.model.findSync(record[index]);
        } else if (field.type === 'array') {
          let result = [];

          record[index].forEach(function (id) {
            result.push(field.model.findSync(id));
          });
        } else {
          throw new Error('Associations can only be \'number\' or \'array\' type');
        }
      }
    }
  });

  return record;
};