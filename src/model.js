/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var fs = require('fs')
  , Promise = require('promise');

/**
 * Merge two objects
 *
 * @param {Object} obj2
 *
 * @return {Object}
 */
Object.prototype.merge = function (obj2){
  let obj3 = {};

  for (let k in this) {
    if (this.hasOwnProperty(k)) {
      obj3[k] = this[k];
    }
  }

  for (let k in obj2) {
    if (obj2.hasOwnProperty(k)) {
      obj3[k] = obj2[k];
    }
  }

  return obj3;
}

/**
 * Check if all values from array are equal
 *
 * @param {mixed} value
 *
 * @return {boolean}
 */
Array.prototype.allValuesSameWithValue = function (value) {
  let e = true;

  for (let k = 0; k < arr.length; k++) {
    if (arr[k] != arr[0] || arr[k] != value) {
      e = false;
    }
  }

  return e;
}

/**
 * Check if an array has a cetain value
 *
 * @param {mixed} value
 *
 * @return {boolean}
 */
Array.prototype.contains = function (value) {
  for (let k in this) {
    if (this[k] == value) {
      return true;
    }
  }

  return false;
};

/**
 * Model prototype
 *
 * @param {string} db
 * @param {string} collection
 */
function Model (db, collection) {
  this.file = db;
  this.collection = collection;
  this.fields;
};

/**
 * Delete a record by a criteria
 *
 * @param {Object}|{integer} where
 *
 * @return {boolean}
 */
Model.prototype.deleteSync = function (where) {
  this._checkFieldOnFile();

  let db = require(this.file);

  if (typeof where == 'object') {
    if (!where.length) {
      db[this.collection] = [];
    } else {
      if (this._validateFields(where)) {
        if (!db[this.collection].length) {
          return false;
        }

        let equals = [];

        for (let k in db[this.collection]) {
          if (db[this.collection].hasOwnProperty(k)) {
            let e = [];

            for (let i in where) {
              if (where.hasOwnProperty(i)) {
                if (db[this.collection][k][i] == where[i]) {
                  e.push({equals: true, registry: k});
                } else {
                  e.push({equals: false});
                }
              }
            }

            equals.push(e);
          }
        }

        for (let k in equals) {
          if (equals.hasOwnProperty(k)) {
            if (equals[k].equals.allValuesSameWithValue(true)) {
              db[this.fields][equals[k].registry]
            }
          }
        }
      }
    }
  } else {
    let index;
    
    for (let k in db[this.collection]) {
      if (db[this.collection][k].id == where) {
        index = k;
      }
    }

    if (typeof index === 'undefined') {
      return false;
    }

    db[this.collection].splice(index, 1);

    return true;
  }

  this._saveModifications(db);
};

/**
 * Delete a record by a criteria
 *
 * @param {Object}|{integer} where
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
 * @return {boolean}
 */
Model.prototype.addSync = function (fields) {
  this._checkFieldOnFile();
  
  if (this._validateFields(fields)) {
    let db = require.main.require(this.file);
    let id = db[this.collection].length ? db[this.collection][db[this.collection].length - 1].id + 1 : 1;
    db[this.collection].push({id: id}.merge(fields));
    this._saveModifications(db);

    return true;
  }

  return false;
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
 * @param {Object}|{integer} where
 * @param {string}           order
 *
 * @return {boolean}
 */
Model.prototype.findSync = function (where, order) {
  this._checkFieldOnFile();

  let db = require(this.file);
  
  if (typeof where === 'object') {
    if (this._validateFields(where)) {
      let result = [];
      order = order ? order : 'desc';

      if (!db[this.collection].length) {
        return false;
      }

      if (!where.length) {
        return this.findAllSync(order);
      }

      let equals = [];

      for (let k in db[this.collection]) {
        if (db[this.collection].hasOwnProperty(k)) {
          let e = {equals: [], registry: {}};

          for (let i in where) {
            if (where.hasOwnProperty(i)) {
              if (db[this.collection][k][i] == where[i]) {
                e.equals.push(true);
                e['registry'] = db[this.collection][k];
              } else {
                e.equals.push(false);
              }
            }
          }

          equals.push(e);
        }
      }

      for (let k in equals) {
        if (equals.hasOwnProperty(k)) {
          if (allValuesSameWithValue(equals[k].equals, true)) {
            result.push(equals[k].registry);
          }
        }
      }

      if (order == 'asc') {
        // Nothing
      } else if (order == 'desc') {
        result.reverse();
      }

      return result.length ? result : false;
    }
  }

  for (let k in db[this.collection]) {
    if (db[this.collection].hasOwnProperty(k)) {
      if (db[this.collection][k].id == where) {
        return db[this.collection][k];
      }
    }
  }

  return false;
};

/**
 * Find a record by a criteria
 *
 * @param {Object}|{integer} where
 * @param {string}           order
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
 * Update a record
 *
 * @param {Object}           data
 * @param {Object}|{integer} where
 *
 * @return {boolean}|void
 */
Model.prototype.setSync = function (data, where) {
  this._checkFieldOnFile();

  if (this._validateFields(data) && this._validateFields(where)) {
    let db = require(this.file);
    let result = this.get(where);
    let registry = typeof result === 'object' ? result : result[0];

    for (let k in data) {
      registry[k] = data[k];
    }

    for (let k in db[this.collection]) {
      if (parseInt(db[this.collection][k].id) == parseInt(registry.id)) {
        db[this.collection][k] = registry;
        this._saveModifications(db);

        return true;
      }
    }
  }
};

/**
 * Update a record
 *
 * @param {Object}           data
 * @param {Object}|{integer} where
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
 * @param {Object}|{integer} where
 *
 * @return {boolean}
 */
Model.prototype.hasSync = function (where) {
  this._checkFieldOnFile();

  if (this._validateFields(where)) {
    let db = require(this.file);

    if (!db[this.collection].length) {
      return false;
    }

    let equals = [];

    for (let k in db[this.collection]) {
      let e = [];

      for (let i in where) {
        if (db[this.collection][k][i] == where[i]) {
          e.push(true);
        } else {
          e.push(false);
        }
      }

      equals.push(e);
    }

    for (let k in equals) {
      if (allValuesSameWithValue(equals[k], true)) {
        return true;
      }
    }

    return false;
  }
};

/**
 * Check if a record exists in database
 *
 * @param {Object}|{integer} where
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
  this._checkFieldOnFile();

  if (this._validateFields(where)) {
    opts = typeof opts === 'undefined' ? {} : opts;
    let db = require(this.file);
    let result = [];

    if (!db[this.collection].length) {
      return false;
    }

    for (let k in db[this.collection]) {
      let valids = [];

      for (let i in where) {
        let r = opts['lowerCase'] ? db[this.collection][k][i].toLowerCase().search(where[i]) + 1 : db[this.collection][k][i].search(where[i]) + 1;
        valids.push(r ? true : false);
      }

      if (allValuesSameWithValue(valids, true)) {
        result.push(db[this.collection][k]);
      }
    }

    return result.length ? result : false;
  }
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
 * @param {string} order
 *
 * @return {Array}
 */
Model.prototype.findAllSync = function (order) {
  this._checkFieldOnFile();

  order = order ? order : 'desc';
  let result = require(this.file)[this.collection];
  if (order == 'asc') {
    // Nothing
  } else if (order == 'desc') {
    result.reverse();
  }

  return result;
};

/**
 * Find all records
 *
 * @param {string} order
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
 * @return {boolean}
 */
Model.prototype._validateFields = function (fields) {
  if (typeof fields == 'object') {
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        if (!Object.keys(this.fields).contains(field)) {
          if (field != 'id') {
            throw 'Unknown field in model ' + this.collection + ': ' + field + '.';
          }
        } else {
          let type = this.fields[field].type.toString().toLowerCase();
          let fieldValidators = require('./field_validators');

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

Model.prototype._checkFieldOnFile = function () {
  let field = require(this.file)[this.collection];

  if (typeof field == 'undefined') {
    throw Error('Undefined JSON key: ' + this.collection);
  }

  if (!(field instanceof Array)) {
    throw Error('"'+  this.collection + '" key must be an array.');
  }
};

Model.prototype._saveModifications = function (db) {
  fs.writeFileSync(this.file, JSON.stringify(db, null, '  '));
};

module.exports = Model;