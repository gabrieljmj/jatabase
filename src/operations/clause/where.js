/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const utils = require('../../utils');

module.exports = function (Model) {
  return function (fields) {
    let db = require(Model.file),
      collection = db[Model.collection],
      result = [];

    for (let k = 0, len = collection.length; k < len; k++) {
      if (utils.object.propertiesEqualsTo(collection[k], fields)) {
        result.push(collection[k]);
      }
    }

    return result;
  };
};