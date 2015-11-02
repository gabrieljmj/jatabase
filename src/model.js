/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var fs = require('fs'),
  _json = require('./_json'),
  utils = require('./utils');

var ModelValidator = function (model) {
  this.model = model;
};

ModelValidator.prototype.validateFile = function () {
  let field = require(this.model.file)[this.model.collection];

  if (typeof field == 'undefined') {
    throw Error('Undefined JSON key: ' + this.model.collection);
  }

  if (!(field instanceof Array)) {
    throw Error('"'+  this.model.collection + '" key must be an array.');
  }
};

var operation = function (operation) {
  return require('./operations/' + operation);
};

/**
 * Model prototype
 *
 * @param {String} db
 * @param {String} collection
 */
function Model (db, collection, fields, context) {
  this.file = db;
  this.collection = collection;
  this.fields = fields;
  this.context = context;
};

/**
 * Delete a record by a criteria
 *
 * @param {Object}|{Integer} where
 *
 * @return {Boolean}
 */
Model.prototype.deleteSync = function (where) {
  this._validateFile();

  let del = operation('delete'),
    deleteFn = del(this);

  return deleteFn(where);
};

/**
 * Delete a record by a criteria
 *
 * @param {Object}|{Integer} where
 *
 * @return {Promise}
 */
Model.prototype.delete = function (where) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(this.deleteSync(where));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Insert a record on database
 *
 * @param {Object} fields
 *
 * @return {Boolean}
 */
Model.prototype.addSync = function (fields) {
  this._validateFile();
  let add = operation('add'),
    addFn = add(this);

  return addFn(fields);
};

/**
 * Insert a record on database
 *
 * @param {Object} fields
 *
 * @return {Promise}
 */
Model.prototype.add = function (fields) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.addSync(fields));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Find a record by a criteria
 *
 * @param {Object}|{Integer} where
 * @param {String}           order
 *
 * @return {Boolean}
 */
Model.prototype.findSync = function (where, order) {
  this._validateFile();

  let find = operation('find'),
    findFn = find(this);

  return findFn(where, order);
};

/**
 * Find records by a criteria
 *
 * @param {Object}|{Integer} where
 * @param {String}           order
 *
 * @return {Promise}
 */
Model.prototype.find = function (where, order) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.findSync(where, order));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Find one record by a criteria
 *
 * @param {Òbject}|{Integer} where
 *
 * @return {Object}
 */
Model.prototype.findOneSync = function (where) {
  let all = this.findSync(where);
  
  return all != false ? all[0] : false;
};

/**
 * Find one record by a criteria
 *
 * @param {Òbject}|{Integer} where
 *
 * @return {Object}
 */
Model.prototype.findOne = function (where) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.findOneSync(where));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Update a record
 *
 * @param {Object}           data
 * @param {Object}|{Integer} where
 *
 * @return {Boolean}|void
 */
Model.prototype.setSync = function (data, where) {
  this._validateFile();

  let set = operation('set'),
    setFn = set(this);

  return setFn(data, where);
};

/**
 * Update a record
 *
 * @param {Object}           data
 * @param {Object}|{Integer} where
 *
 * @return {Promise}
 */
Model.prototype.set = function (data, where) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.setSync(data, where));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Check if a record exists in database
 *
 * @param {Object}|{Integer} where
 *
 * @return {Boolean}
 */
Model.prototype.hasSync = function (where) {
  this._validateFile();

  let has = operation('has'),
    hasFn = has(this);

  return hasFn(where);  
};

/**
 * Check if a record exists in database
 *
 * @param {Object}|{Integer} where
 *
 * @return {Promise}
 */
Model.prototype.has = function (where) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.hasSync(where));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Search by a term on database
 *
 * @param {Object} where
 * @param {Object} opts
 *
 * @return {Array}
 */
Model.prototype.searchSync = function (where, opts) {
  this._validateFile();

  let search = operation('search'),
    searchFn = search(this);

  return searchFn(where, opts);
};

/**
 * Search by a term on database
 *
 * @param {Object} where
 * @param {Object} opts
 *
 * @return {Promise}
 */
Model.prototype.search = function (where, opts) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.searchSync(where, opts));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Find all records
 *
 * @param {String} order
 *
 * @return {Array}
 */
Model.prototype.findAllSync = function (order) {
  this._validateFile();

  let findAll = operation('findall'),
    findAllFn = findAll(this);

  return findAllFn(order);
};

/**
 * Find all records
 *
 * @param {String} order
 *
 * @return {Promise}
 */
Model.prototype.findAll = function (order) {
  let that = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(that.findAllSync(order));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Validates fields on a model
 *
 * @param {Object} fields
 *
 * @return {Boolean}
 */
Model.prototype._validateFields = function (fields) {
  if (typeof fields == 'object') {
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        if (!utils.array.contains(Object.keys(this.fields), field)) {
          if (field != 'id') {
            throw 'Unknown field in model ' + this.collection + ': ' + field + '.';
          }
        } else {
          let type = this.fields[field].type.toString().toLowerCase(),
            fieldValidators = require('./field_validators');

          if (typeof fieldValidators.type[type] == 'undefined') {
            throw Error('"' + type + '" is an invalid field type.');
          }

          if (typeof type != 'undefined') {
            if (!fieldValidators.type[type].call(undefined, fields[field])) {
              throw Error('"' + field + '" expects a ' + type + '.');
            }
          }
        }
      }
    }
  }

  return true;
};

Model.prototype._validateFile = function () {
  let validator = new ModelValidator(this);
  return validator.validateFile();
};

Model.prototype._saveModifications = function (data) {
  let json = new _json(this.file);
  json.update(data);
};

Model.prototype._saveModificationOnKey = function (key, data) {
  let json = new _json(this.file);
  json.updateKey(key, data);
};

module.exports = Model;