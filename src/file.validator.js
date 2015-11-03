/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

const fs = require('fs');

/**
 * Verify if the file exists and if is a JSON
 *
 * @param {String} file
 */
module.exports = function (file) {
  let fileParts = file.split('.');

  if (fileParts[fileParts.length - 1].toLowerCase() != 'json') {
    throw new Error('File must have .json extension.');
  }

  fs.stat(file, function(err, stat) {
    if (err != null && err.code == 'ENOENT') {
      throw new Error('File does not exists: ' + file);
    }
  });
};