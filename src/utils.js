/**
 * Jatabase
 *
 * @author Gabriel Jacinto <gamjj74@hotmail.com>
 * @license MIT License
 * @package jatabase
 */

'use strict';

module.exports = {
  array: {
    /**
     * Check if all values from array are equal
     *
     * @param {Mixed} value
     *
     * @return {Boolean}
     */
    allValuesSame: function (arr, value) {
      for (let k = 0; k < arr.length; k++) {
        if (arr[k] != arr[0] || arr[k] != value) {
          return false;
        }
      }

      return true;
    },

    /**
     * Check if an array has a cetain value
     *
     * @param {Mixed} value
     *
     * @return {Boolean}
     */
    contains: function (arr, value) {
      for (let k in arr) {
        if (arr[k] == value) {
          return true;
        }
      }

      return false;
    },

    /**
     * Check if all values from array property are equal
     *
     * @param {Mixed} value
     *
     * @return {Boolean}
     */
    allValuesSameWithValue: function (arr, property, value) {
      for (let k = 0; k < arr.length; k++) {
        if (arr[k][property] != arr[0][property] || arr[k][property] != value) {
          return false;
        }
      }

      return true;
    }
  },
  object: {
    /**
     * Merge two objects
     *
     * @param {Object} obj2
     *
     * @return {Object}
     */
    merge: function (obj1, obj2){
      let obj3 = {};

      for (let k in obj1) {
        if (obj1.hasOwnProperty(k)) {
          obj3[k] = obj1[k];
        }
      }

      for (let k in obj2) {
        if (obj2.hasOwnProperty(k)) {
          obj3[k] = obj2[k];
        }
      }

      return obj3;
    },

    size: function(obj) {
      let size = 0

      for (let k in obj) {
          if (obj.hasOwnProperty(k)) {
            size++;
          }
      }

      return size;
    },

    propertiesEqualsTo: function (obj1, obj2) {
      for (var k in object) {
        if (object.hasOwnProperty(k)) {
          if (typeof obj1[k] == 'undefined' || obj1[k] != object[k]) {
            return false;
          }
        }
      }

      return true;
    }
  }
};