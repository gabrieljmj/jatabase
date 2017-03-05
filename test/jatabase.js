'use strict';

const expect = require('chai').expect,
  fs = require('fs'),
  file = {
    unchangeable: __dirname + '/db.unchangeable.json',
    unchangeable_with_countries: __dirname + '/db.unchangeable.countries.json',
    changeable_delete: __dirname + '/db.changeable.del.json',
    changeable_add: __dirname + '/db.changeable.add.json',
    changeable_add_with_auto: __dirname + '/db.changeable.add-w-auto.json',
    changeable_set: __dirname + '/db.changeable.set.json'
  },
  Jatabase = require('../src/jatabase'),
  restore = file => {
    fs.writeFile(file, JSON.stringify({cities: [
      {_id: 1, name: 'Sao Paulo'},
      {_id: 2, name: 'Rio de Janeiro'},
      {_id: 3, name: 'New York'}
    ]}));
  },
  objectsAreEqual = (obj1, obj2) => {
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

describe('Jatabase tests', () => {
  describe('#deleteSync()', () => {
    afterEach(() => {
      restore(file.changeable_delete);
    });

    it('should delete a record by it id', () => {
      let jb = new Jatabase(file.changeable_delete),
        model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync(2);

      let now = require(file.changeable_delete),
        expected = {cities: [
          {_id: 1, name: 'Sao Paulo'},
          {_id: 3, name: 'New York'}
        ]};

      expect(objectsAreEqual(now, expected)).to.equal(true);
    });

    it('should delete a record by a field', () => {
      let jb = new Jatabase(file.changeable_delete),
        model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync({name: 'New York'});

      let now = require(file.changeable_delete),
        expected = {cities: [
          {_id: 1, name: 'Sao Paulo'},
          {_id: 2, name: 'Rio de Janeiro'}
        ]};
      expect(objectsAreEqual(now, expected)).to.equal(true);
    });

    it('should throw a exception when a invalid record ID is passed', () => {
      let jb = new Jatabase(file.changeable_delete),
        model = jb.createModel('cities', {name: {type: 'string'}});
      expect(model.deleteSync.bind(model, 5)).to.throw('Record with ID "5" was not found');
    });
  });

  describe('#addSync()', () => {
    afterEach(() => {
      restore(file.changeable_add);
      restore(file.changeable_add_with_auto);
    });

    it('should add without errors', () => {
      let jb = new Jatabase(file.changeable_add),
        model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync({name: 'Londres'});

      let now = require(file.changeable_add),
          expected = {cities: [
            {_id: 1, name: 'Sao Paulo'},
            {_id: 2, name: 'Rio de Janeiro'},
            {_id: 3, name: 'New York'},
            {_id: 4, name: 'Londres'}
          ]};

      expect(objectsAreEqual(now, expected)).to.equal(true);
    });

    it('should add without errors', () => {
      let jb = new Jatabase(file.changeable_add),
        model = jb.createModel('cities', {name: {type: 'string'}});

      model.deleteSync({name: 'Londres'});

      let now = require(file.changeable_add),
        expected = {cities: [
          {_id: 1, name: 'Sao Paulo'},
          {_id: 2, name: 'Rio de Janeiro'},
          {_id: 3, name: 'New York'},
          {_id: 4, name: 'Londres'}
        ]};

      expect(objectsAreEqual(now, expected)).to.equal(true);
    });

    /*it('should add without error auto completing field specified', () => {
      let jb = new Jatabase(file.changeable_add),
        date = new Date();
      let model = jb.createModel('cities', {
        name: {type: 'string'},
        created_at: {type: 'date', auto: true}
      });

      model.deleteSync({name: 'Londres'});

      let now = require(file.changeable_add),
        expected = {cities: [
          {_id: 1, name: 'Sao Paulo', created_at: new Date('2017-02-14T12:15:44.053Z')},
          {_id: 2, name: 'Rio de Janeiro', created_at: new Date('2017-02-14T12:15:44.053Z')},
          {_id: 3, name: 'New York', created_at: new Date('2017-02-14T12:15:44.053Z')},
          {_id: 4, name: 'Londres', created_at: date}
        ]};

      expect(objectsAreEqual(now, expected)).to.equal(true);
    });*/
  });

  describe('#findSync()', () => {
    it('should find record by id', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = {_id: 1, name: 'Sao Paulo'},
        given = model.findSync(1);

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should find record by fields', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = {_id: 1, name: 'Sao Paulo'},
        given = model.findSync({name: 'Sao Paulo'});

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should return false when record searched by id does not exists', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = false,
        given = model.findSync(5);

      expect(given).to.equal(expected);
    });

    it('should return false when record searched by fields does not exists', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = false,
        given = model.findSync({name: 'Invalid city'});

      expect(given).to.equal(expected);
    });

    it('should return all records when a empty object is passed', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = require(file.unchangeable),
        given = model.findSync({});

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should associate to another collection by id', () => {
      let jb = new Jatabase(file.unchangeable_with_countries),
        countriesModel = jb.createModel('countries', {name: {type: 'string'}}),
        citiesModel = jb.createModel('cities', {
          name: {type: 'string'},
          country: {type: 'number', associatedTo: 'countries'}
        }),
        expected = {_id: 1, name: 'São Paulo', country: {_id: 1, name: 'Brazil'}},
        given = citiesModel.findSync(1);

        expect(objectsAreEqual(expected, given)).to.equal(true);
    });
  });

  describe('#findAllSync', () => {
    it('should return all records', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = require(file.unchangeable).cities,
        given = model.findAllSync();

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should return all records desc sorted', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = require(file.unchangeable).cities.reverse(),
        given = model.findAllSync('desc');

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should return all records asc sorted', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = require(file.unchangeable).cities,
        given = model.findAllSync('asc');

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });
  });

  describe('#has()', () => {
    it('should return true for existent record by id', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = true,
        given = model.hasSync(1);

      expect(given).to.equal(expected);
    });

    it('should return true for existent record by fields', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = true,
        given = model.hasSync({name: 'Sao Paulo'});

      expect(given).to.equal(expected);
    });

    it('should return false for inexistent record by id', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = false,
        given = model.hasSync(17);

      expect(given).to.equal(expected);
    });

    it('should return false for inexistent record by fields', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}}),
        expected = false,
        given = model.hasSync({name: 'Invalid city'});

      expect(given).to.equal(expected);
    });
  });

  describe('#setSync()', () => {
    afterEach(() => {
      restore(file.changeable_set);
    });

    it('should set by ID without errors', () => {
      let jb = new Jatabase(file.changeable_set),
        model = jb.createModel('cities', {name: {type: 'string'}});

      model.setSync({name: 'Los Angeles'}, 3);

      let expected = {cities: [
          {_id: 1, name: 'Sao Paulo'},
          {_id: 2, name: 'Rio de Janeiro'},
          {_id: 3, name: 'Los Angeles'}
        ]},
        given = require(file.changeable_set);

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });

    it('should set by fields without errors', () => {
      let jb = new Jatabase(file.changeable_set),
        model = jb.createModel('cities', {name: {type: 'string'}});

      model.setSync({name: 'Dubai'}, {name: 'Rio de Janeiro'});

      let expected = {cities: [
          {_id: 1, name: 'Sao Paulo'},
          {_id: 2, name: 'Dubai'},
          {_id: 3, name: 'Los Angeles'}
        ]},
        given = require(file.changeable_set);

      expect(objectsAreEqual(expected, given)).to.equal(true);
    });
  });

  describe('#searchSync()', () => {
    it('should return the only one expected', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}});

      let expected = [
          {_id: 1, name: 'Sao Paulo'}
        ],
        given = model.searchSync({name: 'Sao'});

      expect(
        given.length === 1 &&
        given[0]._id == expected[0]._id &&
        given[0].name == expected[0].name
      ).to.equal(true);
    });

    it('should return all expected', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}});

      let expected = [
          {_id: 1, name: 'Sao Paulo'},
          {_id: 2, name: 'Rio de Janeiro'}
        ],
        given = model.searchSync({name: 'a'});

      expect(
        given.length === 2 &&
        (given[0]._id == expected[0]._id &&
        given[0].name == expected[0].name) &&
        (given[1]._id == expected[1]._id &&
        given[1].name == expected[1].name)
      ).to.equal(true);
    });

    it('should return false with case sentitive on', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}});

      let given = model.searchSync({name: 'sao'});

      expect(given).to.equal(false);
    });

    it('should return all expected with case sentitive off', () => {
      let jb = new Jatabase(file.unchangeable),
        model = jb.createModel('cities', {name: {type: 'string'}});

      let expected = [
          {_id: 2, name: 'Rio de Janeiro'}
        ],
        given = model.searchSync({name: 'rio'}, {lowerCase: true});

      expect(
        given.length === 1 &&
        (given[0]._id == expected[0]._id &&
        given[0].name == expected[0].name)
      ).to.equal(true);
    });
  });
});