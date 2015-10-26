/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

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
  var obj3 = {};

  for (var k in this) {
    if (this.hasOwnProperty(k)) {
      obj3[k] = this[k];
    }
  }

  for (var k in obj2) {
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
  var e = true;

  for (var k = 0; k < arr.length; k++) {
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
  for (var k in this) {
    if (this[k] == value) {
      return true;
    }
  }

  return false;
}

/**
 * Model prototype
 *
 * @param {string} db
 * @param {string} name
 */
function Model (db, name) {
  this.file = db;
  this.name = name;
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

  var db = require(this.file);

  if (typeof where == 'object') {
    if (!where.length) {
      db[this.name] = [];
    } else {
      if (this._validateFields(Object.keys(where))) {
        if (!db[this.name].length) {
          return false;
        }

        var equals = [];

        for (var k in db[this.name]) {
          if (db[this.name].hasOwnProperty(k)) {
            var e = [];

            for (var i in where) {
              if (where.hasOwnProperty(i)) {
                if (db[this.name][k][i] == where[i]) {
                  e.push({equals: true, registry: k});
                } else {
                  e.push({equals: false});
                }
              }
            }

            equals.push(e);
          }
        }

        for (var k in equals) {
          if (equals.hasOwnProperty(k)) {
            if (equals[k].equals.allValuesSameWithValue(true)) {
              db[this.fields][equals[k].registry]
            }
          }
        }
      }
    }
  } else {
    var index;
    
    for (var k in db[this.name]) {
      if (db[this.name][k].id == where) {
        index = k;
      }
    }

    if (typeof index === 'undefined') {
      return false;
    }

    db[this.name].splice(index, 1);

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
  
  if (this._validateFields(Object.keys(fields))) {
    var db = require.main.require(this.file);
    var id = db[this.name].length ? db[this.name][db[this.name].length - 1].id + 1 : 1;
    db[this.name].push({id: id}.merge(fields));
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
  var that = this;

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

  var db = require(this.file);
  
  if (typeof where === 'object') {
    var result = [];
    order = order ? order : 'desc';

    if (!db[this.name].length) {
      return false;
    }

    if (!where.length) {
      return this.findAllSync(order);
    }

    var equals = [];

    for (var k in db[this.name]) {
      if (db[this.name].hasOwnProperty(k)) {
        var e = {equals: [], registry: {}};

        for (var i in where) {
          if (where.hasOwnProperty(i)) {
            if (db[this.name][k][i] == where[i]) {
              e.equals.push(true);
              e['registry'] = db[this.name][k];
            } else {
              e.equals.push(false);
            }
          }
        }

        equals.push(e);
      }
    }

    for (var k in equals) {
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

  for (var k in db[this.name]) {
    if (db[this.name].hasOwnProperty(k)) {
      if (db[this.name][k].id == where) {
        return db[this.name][k];
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
  var that = this;

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

  if (this._validateFields(Object.keys(data)) && this._validateFields(Object.keys(where))) {
    var db = require(this.file);
    var result = this.get(where);
    var registry = typeof result === 'object' ? result : result[0];

    for (var k in data) {
      registry[k] = data[k];
    }

    for (var k in db[this.name]) {
      if (parseInt(db[this.name][k].id) == parseInt(registry.id)) {
        db[this.name][k] = registry;
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
  var that = this;

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

  if (this._validateFields(Object.keys(where))) {
    var db = require(this.file);

    if (!db[this.name].length) {
      return false;
    }

    var equals = [];

    for (var k in db[this.name]) {
      var e = [];

      for (var i in where) {
        if (db[this.name][k][i] == where[i]) {
          e.push(true);
        } else {
          e.push(false);
        }
      }

      equals.push(e);
    }

    for (var k in equals) {
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
  var that = this;

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

  if (this._validateFields(Object.keys(where))) {
    opts = typeof opts === 'undefined' ? {} : opts;
    var db = require(this.file);
    var result = [];

    if (!db[this.name].length) {
      return false;
    }

    for (var k in db[this.name]) {
      var valids = [];

      for (var i in where) {
        var r = opts['lowerCase'] ? db[this.name][k][i].toLowerCase().search(where[i]) + 1 : db[this.name][k][i].search(where[i]) + 1;
        valids.push(r ? true : false);
      }

      if (allValuesSameWithValue(valids, true)) {
        result.push(db[this.name][k]);
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
  var that = this;

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
  var result = require(this.file)[this.name];
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
  var that = this;

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
  for (var k in fields) {
    if (fields.hasOwnProperty(k)) {
      if (!this.fields.contains(fields[k])) {
        if (fields[k] != 'id') {
          throw 'Unknown field in model ' + this.name + ': ' + fields[k];
        }
      }
    }
  }

  return true;
};

Model.prototype._checkFieldOnFile = function () {
  var field = require(this.file)[this.name];

  if (typeof field == 'undefined') {
    throw Error('JSON key undefined: ' + this.name);
  }
};

Model.prototype._saveModifications = function (db) {
  fs.writeFileSync(this.file, JSON.stringify(db, null, '  '));
};

module.exports = Model;