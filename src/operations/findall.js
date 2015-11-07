/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const filter = require('./filters/filters');

module.exports = function (Model) {
  return function (order) {
    order = order ? order : 'desc';
    let result = require(Model.file)[Model.collection];

    if (order == 'asc') {
      // Nothing
    } else if (order == 'desc') {
      result.reverse();
    }

    for (let k in result) {
      if (result.hasOwnProperty(k)) {
        result[k] = filter(Model, result[k]);
      }
    }

    return result;
  }
};