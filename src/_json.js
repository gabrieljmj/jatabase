/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const fs = require('fs'),
  validateFile = require('./file.validator');

const _Json = function (file) {
  validateFile(file);

  this.file = file;
};

_Json.prototype.update = function (data) {
  return fs.writeFile(this.file, JSON.stringify(data), 'utf8', function (err) {
    if (err != null) {
      throw Error(err);
    }
  });
};

_Json.prototype.updateKey = function (key, value) {
  let data = require(this.file);
  data[key] = value;

  return this.update(data);
};

module.exports = _Json;