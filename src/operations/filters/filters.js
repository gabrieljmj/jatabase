/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const dateFilter = require('./date');

module.exports = function (Model, record) {
  record = dateFilter(Model, record);

  return record;
};