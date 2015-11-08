'use strict';

const expect = require('chai').expect,
      fs = require('fs'),
      file = {
        unchangeable: __dirname + '/db.unchangeable.json',
        changeable_delete: __dirname + '/db.changeable.del.json',
        changeable_add: __dirname + '/db.changeable.add.json',
        changeable_set: __dirname + '/db.changeable.set.json'
      },
      Jatabase = require('../src/jatabase'),
      restore = function (file) {
        /*let fileParts = file.split('/'),
          fileNameParts = fileParts[fileParts.length - 1].split('.');

        fileNameParts.splice(fileNameParts.length - 1, 1);

        let contextFile = '.' + fileNameParts.join('.') + '.context.json';

        fs.unlink(__dirname + '/' + contextFile);*/

        fs.writeFile(file, JSON.stringify({cities: [
          {id: 1, name: 'Sao Paulo'},
          {id: 2, name: 'Rio de Janeiro'},
          {id: 3, name: 'New York'}
        ]}));
      };

describe('Jatabase tests', function () {
  describe('#deleteSync()', function () {
    afterEach(function () {
      restore(file.changeable_delete);
    });

    it('should delete a record by it id', function () {
      let jb = new Jatabase(file.changeable_delete);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync(2);

      let now = require(file.changeable_delete),
          expected = {cities: [
            {id: 1, name: 'Sao Paulo'},
            {id: 3, name: 'New York'}
          ]};

      expect(objectsAreEqual(now, expected)).to.equal(true);
    });

    it('should delete a record by a field', function () {
      let jb = new Jatabase(file.changeable_delete);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync({name: 'New York'});

      let now = require(file.changeable_delete),
          expected = {cities: [
            {id: 1, name: 'Sao Paulo'},
            {id: 2, name: 'Rio de Janeiro'}
          ]};
      expect(objectsAreEqual(now, expected)).to.equal(true);
    });

    it('should throw a exception when a invalid record ID is passed', function () {
      let jb = new Jatabase(file.changeable_delete);
      let model = jb.createModel('cities', {name: {type: 'string'}});
      expect(model.deleteSync.bind(model, 5)).to.throw('Record with ID "5" was not found');
    });
  });

  describe('#addSync()', function () {
    afterEach(function () {
      restore(file.changeable_add);
    });

    it('should add without errors', function () {
      let jb = new Jatabase(file.changeable_add);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync({name: 'Londres'});

      let now = require(file.changeable_add),
          expected = {cities: [
            {id: 1, name: 'Sao Paulo'},
            {id: 2, name: 'Rio de Janeiro'},
            {id: 3, name: 'New York'},
            {id: 4, name: 'Londres'}
          ]};

      expect(objectsAreEqual(now, expected)).to.equal(true);
    });
  });

  describe('#findSync()', function () {
    it('should find record by id', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = {id: 1, name: 'Sao Paulo'},
          given = model.findSync(1);

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should find record by fields', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = {id: 1, name: 'Sao Paulo'},
          given = model.findSync({name: 'Sao Paulo'});

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should return false when record searched by id does not exists', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = false,
          given = model.findSync(5);

      expect(given).to.equal(expected);
    });

    it('should return false when record searched by fields does not exists', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = false,
          given = model.findSync({name: 'Invalid city'});

      expect(given).to.equal(expected);
    });

    it('should return all records when a empty object is passed', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = require(file.unchangeable),
          given = model.findSync({});

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });
  });

  describe('#findAllSync', function () {
    it('should return all records', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = require(file.unchangeable).cities,
          given = model.findAllSync();

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should return all records desc sorted', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = require(file.unchangeable).cities.reverse(),
          given = model.findAllSync('desc');

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should return all records asc sorted', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = require(file.unchangeable).cities,
          given = model.findAllSync('asc');

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });
  });

  describe('#has()', function () {
    it('should return true for existent record by id', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = true,
          given = model.hasSync(1);

      expect(given).to.equal(expected);
    });

    it('should return true for existent record by fields', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = true,
          given = model.hasSync({name: 'Sao Paulo'});

      expect(given).to.equal(expected);
    });

    it('should return false for inexistent record by id', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = false,
          given = model.hasSync(17);

      expect(given).to.equal(expected);
    });

    it('should return false for inexistent record by fields', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}}),
          expected = false,
          given = model.hasSync({name: 'Invalid city'});

      expect(given).to.equal(expected);
    });
  });

  describe('#setSync()', function () {
    afterEach(function () {
      restore(file.changeable_set);
    });

    it('should set by ID without errors', function () {
      let jb = new Jatabase(file.changeable_set);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      model.setSync({name: 'Los Angeles'}, 3);

      let expected = {cities: [
          {id: 1, name: 'Sao Paulo'},
          {id: 2, name: 'Rio de Janeiro'},
          {id: 3, name: 'Los Angeles'}
        ]},
        given = require(file.changeable_set);

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should set by fields without errors', function () {
      let jb = new Jatabase(file.changeable_set);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      model.setSync({name: 'Dubai'}, {name: 'Rio de Janeiro'});

      let expected = {cities: [
          {id: 1, name: 'Sao Paulo'},
          {id: 2, name: 'Dubai'},
          {id: 3, name: 'Los Angeles'}
        ]},
        given = require(file.changeable_set);

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });
  });

  describe('#searchSync()', function () {
    it('should return the only one expected', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      let expected = [
          {id: 1, name: 'Sao Paulo'}
        ],
        given = model.searchSync({name: 'Sao'});

      expect(
        given.length === 1 &&
        given[0].id == expected[0].id &&
        given[0].name == expected[0].name
      ).to.equal(true);
    });

    it('should return all expected', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      let expected = [
          {id: 1, name: 'Sao Paulo'},
          {id: 2, name: 'Rio de Janeiro'}
        ],
        given = model.searchSync({name: 'a'});

      expect(
        given.length === 2 &&
        (given[0].id == expected[0].id &&
        given[0].name == expected[0].name) &&
        (given[1].id == expected[1].id &&
        given[1].name == expected[1].name)
      ).to.equal(true);
    });

    it('should return false with case sentitive on', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      let given = model.searchSync({name: 'sao'});

      expect(given).to.equal(false);
    });

    it('should return all expected with case sentitive off', function () {
      let jb = new Jatabase(file.unchangeable);
      let model = jb.createModel('cities', {name: {type: 'string'}});

      let expected = [
          {id: 2, name: 'Rio de Janeiro'}
        ],
        given = model.searchSync({name: 'rio'}, {lowerCase: true});

      expect(
        given.length === 1 &&
        (given[0].id == expected[0].id &&
        given[0].name == expected[0].name)
      ).to.equal(true);
    });
  });
});

let objectsAreEqual = function (obj1, obj2) {
  for (let k in obj1) {
    if (obj1.hasOwnProperty(k) && obj2.hasOwnProperty(k)) {
      for (let i in obj1) {
        if (obj1[k][i] !== obj2[k][i]) {
          return false;
        }
      }
    }
  }

  return true;
};