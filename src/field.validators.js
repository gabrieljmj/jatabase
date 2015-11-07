/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

module.exports = {
  type: {
    number: function (value) {
      return typeof value == 'number' && !Number.isNaN(value);
    },
    string: function (value) {
      return typeof value == 'string';
    },
    array: function (value) {
      return value instanceof Array;
    },
    object: function (value) {
      return typeof value == 'object';
    },
    date: function (value) {
      return value instanceof Date;
    }
  }
};