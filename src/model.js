/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

var fs = require('fs'),
  JsonDB = require('./jsondb');

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

Object.size = function(obj) {
    let size = 0

    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
          size++;
        }
    }

    return size;
};

Object.prototype.propertiesEqualsTo = function (object) {
  for (var k in object) {
    if (object.hasOwnProperty(k)) {
      if (typeof this[k] == 'undefined' || this[k] != object[k]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if all values from array property are equal
 *
 * @param {Mixed} value
 *
 * @return {Boolean}
 */
Array.prototype.allValuesSameWithValue = function (property, value) {
  for (let k = 0; k < this.length; k++) {
    if (this[k][property] != this[0][property] || this[k][property] != value) {
      return false;
    }
  }

  return true;
}

/**
 * Check if all values from array are equal
 *
 * @param {Mixed} value
 *
 * @return {Boolean}
 */
Array.prototype.allValuesSame = function (value) {
  for (let k = 0; k < this.length; k++) {
    if (this[k] != this[0] || this[k] != value) {
      return false;
    }
  }

  return true;
};

/**
 * Check if an array has a cetain value
 *
 * @param {Mixed} value
 *
 * @return {Boolean}
 */
Array.prototype.contains = function (value) {
  for (let k in this) {
    if (this[k] == value) {
      return true;
    }
  }

  return false;
};

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

/**
 * Model prototype
 *
 * @param {String} db
 * @param {String} collection
 */
function Model (db, collection) {
  this.file = db;
  this.collection = collection;
  this.fields;
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

  let db = require(this.file);
  let collection = db[this.collection]

  if (typeof where == 'object') {
    if (!Object.size(where)) {
      collection = [];
    } else {
      if (this._validateFields(where)) {
        if (!collection.length) {
          return false;
        }

        let equals = [];

        for (let k in collection) {
          if (collection.hasOwnProperty(k)) {
            if (collection[k].propertiesEqualsTo(where)) {
              equals.push(k);
            }
          }
        }

        for (let k in equals) {
          if (equals.hasOwnProperty(k)) {
            collection.splice(equals[k], 1);
          }
        }
      }
    }
  } else {
    let index;
    
    for (let k in collection) {
      if (collection[k].id == where) {
        index = k;
      }
    }

    if (typeof index === 'undefined') {
      return false;
    }

    collection.splice(index, 1);

    return true;
  }

  this._saveModifications(db);
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
  
  if (this._validateFields(fields)) {
    let db = require(this.file);
    let collection = db[this.collection];
    let id = collection.length ? collection[collection.length - 1].id + 1 : 1;
    collection.push({id: id}.merge(fields));
    this._saveModificationOnKey(this.collection, collection);

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
 * @param {Object}|{Integer} where
 * @param {String}           order
 *
 * @return {Boolean}
 */
Model.prototype.findSync = function (where, order) {
  this._validateFile();

  let db = require(this.file);
  let collection = db[this.collection];
  
  if (typeof where === 'object') {
    if (this._validateFields(where)) {
      let result = [];
      order = order ? order : 'desc';

      if (!collection.length) {
        return false;
      }

      if (!Object.size(where)) {
        return this.findAllSync(order);
      }

      let equals = [];

      for (let k in collection) {
        if (collection.hasOwnProperty(k)) {
          if (collection[k].propertiesEqualsTo(where)) {
            equals.push(k);
          }
        }
      }

      for (let k in equals) {
        if (equals.hasOwnProperty(k)) {
          result.push(collection[equals[k]]);
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

  for (let k in collection) {
    if (collection.hasOwnProperty(k)) {
      if (collection[k].id == where) {
        return collection[k];
      }
    }
  }

  return false;
};

/**
 * Find a record by a criteria
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
 * Update a record
 *
 * @param {Object}           data
 * @param {Object}|{Integer} where
 *
 * @return {Boolean}|void
 */
Model.prototype.setSync = function (data, where) {
  this._validateFile();

  if (this._validateFields(data) && this._validateFields(where)) {
    let db = require(this.file);
    let collection = db[this.collection];
    let result = this.findSync(where);

    for (let k in result) {
      if (result.hasOwnProperty(k)) {
        for (let i in data) {
          result[k][i] = data[i];
        }
      }
    }

    for (let k in collection) {
      if (collection.hasOwnProperty(k)) {
        for (let i in result) {
          if (result.hasOwnProperty(i)) {
            if (parseInt(collection[k].id) == parseInt(result[i].id)) {
              collection[k] = result[i];
            }
          }
        }
      }
    }

    this._saveModificationOnKey(this.collection, collection);
    return true
  }
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
      if (equals[k].allValuesSame(true)) {
        return true;
      }
    }

    return false;
  }
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
        let r = opts['lowerCase'] ? db[this.collection][k][i].toLowerCase().search(where[i]) : db[this.collection][k][i].search(where[i]);
        valids.push(r + 1 ? true : false);
      }

      if (valids.allValuesSame(true)) {
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
 * @param {String} order
 *
 * @return {Array}
 */
Model.prototype.findAllSync = function (order) {
  this._validateFile();

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

Model.prototype._validateFile = function () {
  let validator = new ModelValidator(this);
  return validator.validateFile();
}

Model.prototype._saveModifications = function (data) {
  let json = new JsonDB(this.file);
  json.update(data);
};

Model.prototype._saveModificationOnKey = function (key, data) {
  let json = new JsonDB(this.file);
  json.updateKey(key, data);
}

module.exports = Model;