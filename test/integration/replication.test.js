'use strict';

/* jshint -W030 */
/* jshint -W110 */
var chai = require('chai')
  , Sequelize = require('../../index')
  , expect = chai.expect
  , Support = require(__dirname + '/support')
  , DataTypes = require(__dirname + '/../../lib/data-types')
  , dialect = Support.getTestDialect()
  , sinon = require('sinon')
  , _ = require('lodash')
  , moment = require('moment')
  , Promise = require('bluebird');

describe(Support.getTestDialectTeaser('Replication'), function() {
  if (dialect === 'sqlite') return;

  beforeEach(function () {
    this.sequelize = Support.getSequelizeInstance(null, null, null, {
      replication: {
        // Just need empty objects, sequelize will copy in defaults
        write: Support.getConnectionOptions(),
        read: [Support.getConnectionOptions()]
      }
    });

    expect(this.sequelize.connectionManager.pool.write).to.be.ok;
    expect(this.sequelize.connectionManager.pool.read).to.be.ok;

    this.User = this.sequelize.define('User', {
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
      }
    });

    return this.User.sync({force: true});
  });

  it('should be able to make a write', function () {
    return this.User.create({
      firstName: Math.random().toString()
    });
  });

  it('should be able to make a read', function () {
    return this.User.findAll();
  });
});