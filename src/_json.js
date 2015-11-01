/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var fs = require('fs');

var _Json = function (file) {
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

let validateFile = function (file) {
  let fileParts = file.split('.');

  if (fileParts[fileParts.length - 1].toLowerCase() != 'json') {
    throw Error('File must have .json extension.');
  }

  fs.stat(file, function(err, stat) {
    if (err != null && err.code == 'ENOENT') {
      throw Error('File does not exists: ' + file);
    }
  });
};

module.exports = _Json;