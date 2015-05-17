'use strict';

var chai = require('chai')
  , expect = chai.expect
  , Support   = require(__dirname + '/support')
  , DataTypes = require(__dirname + '/../../lib/data-types')
  , Utils     = require(__dirname + '/../../lib/utils');

// Notice: [] will be replaced by dialect specific tick/quote character when there is not dialect specific expectation but only a default expectation

suite(Support.getTestDialectTeaser('Utils'), function() {
  suite('mapOptionFieldNames', function () {
    test('plain where', function () {
      expect(Utils.mapOptionFieldNames({
        where: {
          firstName: 'Paul',
          lastName: 'Atreides'
        }
      }, this.sequelize.define('User', {
        firstName: {
          type: DataTypes.STRING,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          field: 'last_name'
        }
      }))).to.eql({
        where: {
          first_name: 'Paul',
          last_name: 'Atreides'
        }
      });
    });

    test('$or where', function () {
      expect(Utils.mapOptionFieldNames({
        where: {
          $or: {
            firstName: 'Paul',
            lastName: 'Atreides'
          }
        }
      }, this.sequelize.define('User', {
        firstName: {
          type: DataTypes.STRING,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          field: 'last_name'
        }
      }))).to.eql({
        where: {
          $or: {
            first_name: 'Paul',
            last_name: 'Atreides'
          }
        }
      });
    });

    test('$or[] where', function () {
      expect(Utils.mapOptionFieldNames({
        where: {
          $or: [
            {firstName: 'Paul'},
            {lastName: 'Atreides'}
          ]
        }
      }, this.sequelize.define('User', {
        firstName: {
          type: DataTypes.STRING,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          field: 'last_name'
        }
      }))).to.eql({
        where: {
          $or: [
            {first_name: 'Paul'},
            {last_name: 'Atreides'}
          ]
        }
      });
    });

    test('$and where', function () {
      expect(Utils.mapOptionFieldNames({
        where: {
          $and: {
            firstName: 'Paul',
            lastName: 'Atreides'
          }
        }
      }, this.sequelize.define('User', {
        firstName: {
          type: DataTypes.STRING,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          field: 'last_name'
        }
      }))).to.eql({
        where: {
          $and: {
            first_name: 'Paul',
            last_name: 'Atreides'
          }
        }
      });
    });
  });


  suite('stack', function() {
    test('stack trace starts after call to Util.stack()', function this_here_test() {

      function a() {
        return b();
      }

      function b() {
        return c();
      }

      function c() {
        return Utils.stack();
      }

      var stack = a();

      expect(stack[0].getFunctionName()).to.eql('c');
      expect(stack[1].getFunctionName()).to.eql('b');
      expect(stack[2].getFunctionName()).to.eql('a');
      expect(stack[3].getFunctionName()).to.eql('this_here_test');
    });
  });

});