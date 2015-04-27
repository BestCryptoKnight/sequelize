'use strict';

/* jshint -W030 */
/* jshint -W110 */
var chai = require('chai')
  , expect = chai.expect
  , Utils = require(__dirname + '/../../lib/utils')
  , Support = require(__dirname + '/support');

describe(Support.getTestDialectTeaser('Utils'), function() {
  describe('removeCommentsFromFunctionString', function() {
    it('removes line comments at the start of a line', function() {
      var functionWithLineComments = function() {
        // noot noot
      };

      var string = functionWithLineComments.toString()
        , result = Utils.removeCommentsFromFunctionString(string);

      expect(result).not.to.match(/.*noot.*/);
    });

    it('removes lines comments in the middle of a line', function() {
      var functionWithLineComments = function() {
        alert(1); // noot noot
      };

      var string = functionWithLineComments.toString()
        , result = Utils.removeCommentsFromFunctionString(string);

      expect(result).not.to.match(/.*noot.*/);
    });

    it('removes range comments', function() {
      var s = function() {
        alert(1); /*
          noot noot
        */
        alert(2); /*
          foo
        */
      }.toString();

      var result = Utils.removeCommentsFromFunctionString(s);

      expect(result).not.to.match(/.*noot.*/);
      expect(result).not.to.match(/.*foo.*/);
      expect(result).to.match(/.*alert\(2\).*/);
    });
  });

  describe('argsArePrimaryKeys', function() {
    it('doesn\'t detect primary keys if primareyKeys and values have different lengths', function() {
      expect(Utils.argsArePrimaryKeys([1, 2, 3], [1])).to.be.false;
    });

    it('doesn\'t detect primary keys if primary keys are hashes or arrays', function() {
      expect(Utils.argsArePrimaryKeys([[]], [1])).to.be.false;
    });

    it('detects primary keys if length is correct and data types are matching', function() {
      expect(Utils.argsArePrimaryKeys([1, 2, 3], ['INTEGER', 'INTEGER', 'INTEGER'])).to.be.true;
    });

    it('detects primary keys if primary keys are dates and lengths are matching', function() {
      expect(Utils.argsArePrimaryKeys([new Date()], ['foo'])).to.be.true;
    });
  });

  describe('underscore', function() {
    describe('underscoredIf', function() {
      it('is defined', function() {
        expect(Utils._.underscoredIf).to.be.ok;
      });

      it('underscores if second param is true', function() {
        expect(Utils._.underscoredIf('fooBar', true)).to.equal('foo_bar');
      });

      it('doesn\'t underscore if second param is false', function() {
        expect(Utils._.underscoredIf('fooBar', false)).to.equal('fooBar');
      });
    });

    describe('camelizeIf', function() {
      it('is defined', function() {
        expect(Utils._.camelizeIf).to.be.ok;
      });

      it('camelizes if second param is true', function() {
        expect(Utils._.camelizeIf('foo_bar', true)).to.equal('fooBar');
      });

      it('doesn\'t camelize if second param is false', function() {
        expect(Utils._.underscoredIf('fooBar', true)).to.equal('foo_bar');
      });
    });
  });

  describe('format', function() {
    it('should format where clause correctly when the value is truthy', function() {
      var where = ['foo = ?', 1];
      expect(Utils.format(where)).to.equal('foo = 1');
    });

    it('should format where clause correctly when the value is false', function() {
      var where = ['foo = ?', 0];
      expect(Utils.format(where)).to.equal('foo = 0');
    });
  });

  describe('validateParameter', function() {
    describe('method signature', function() {
      it('throws an error if the value is not defined', function() {
        expect(function() {
          Utils.validateParameter();
        }).to.throw('No value has been passed.');
      });

      it('does not throw an error if the value is not defined and the parameter is optional', function() {
        expect(function() {
          Utils.validateParameter(undefined, Object, { optional: true });
        }).to.not.throw();
      });

      it('throws an error if the expectation is not defined', function() {
        expect(function() {
          Utils.validateParameter(1);
        }).to.throw('No expectation has been passed.');
      });
    });

    describe('expectation', function() {
      it('uses the instanceof method if the expectation is a class', function() {
        expect(Utils.validateParameter(new Number(1), Number)).to.be.true; // jshint ignore:line
      });
    });

    describe('failing expectations', function() {
      it('throws an error if the expectation does not match', function() {
        expect(function() {
          Utils.validateParameter(1, String);
        }).to.throw(/The parameter.*is no.*/);
      });
    });
  });

  if (Support.getTestDialect() === 'postgres') {
    describe('json', function() {
      var queryGenerator = require('../../lib/dialects/postgres/query-generator.js');

      it('successfully parses a complex nested condition hash', function() {
        var conditions = {
          metadata: {
            language: 'icelandic',
            pg_rating: { 'dk': 'G' }
          },
          another_json_field: { x: 1 }
        };
        var expected = "metadata#>>'{language}' = 'icelandic' and metadata#>>'{pg_rating,dk}' = 'G' and another_json_field#>>'{x}' = '1'";
        expect(queryGenerator.handleSequelizeMethod(new Utils.json(conditions))).to.deep.equal(expected);
      });

      it('successfully parses a string using dot notation', function() {
        var path = 'metadata.pg_rating.dk';
        expect(queryGenerator.handleSequelizeMethod(new Utils.json(path))).to.equal("metadata#>>'{pg_rating,dk}'");
      });

      it('allows postgres json syntax', function() {
        var path = 'metadata->pg_rating->>dk';
        expect(queryGenerator.handleSequelizeMethod(new Utils.json(path))).to.equal(path);
      });

      it('can take a value to compare against', function() {
        var path = 'metadata.pg_rating.is';
        var value = 'U';
        expect(queryGenerator.handleSequelizeMethod(new Utils.json(path, value))).to.equal("metadata#>>'{pg_rating,is}' = 'U'");
      });
    });
  }

  describe('inflection', function() {
    it('works better than lingo ;)', function() {
      expect(Utils.pluralize('buy')).to.equal('buys');
      expect(Utils.pluralize('holiday')).to.equal('holidays');
      expect(Utils.pluralize('days')).to.equal('days');
      expect(Utils.pluralize('status')).to.equal('statuses');

      expect(Utils.singularize('status')).to.equal('status');
    });
  });
});
