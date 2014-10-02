(function (global) {

  'use strict';

  function impose(file) {
    if (typeof module !== 'undefined' && module.exports) {
      return require(file);
    } else {
      return global.reporterHelpers;
    }
  }

  function expose() {
    if (typeof module !== 'undefined' && module.exports) {
      return exports;
    } else {
      return global;
    }
  }

  var Calculator = impose('./Calculator')
    .Calculator,
    TerminalLogger = impose('./TerminalLogger')
    .TerminalLogger,
    Reporter = function (options, cb) {
      this.started = false;
      this.finished = false;
      this.loggerNo = 1;
      this.calc = new Calculator();
      this.logger = new TerminalLogger(options);
      this.jasmineCallback = cb;
    };

  Reporter.prototype = {
    jasmineStarted: function (runner) {
      this.started = true;
      this.calc.start(runner.totalSpecsDefined);
      this.logger.start(runner, this.calc);
    },

    jasmineDone: function (summary) {
      this.calc.stop();
      this.logger.stop(summary, this.calc);
      this.finished = true;
      if (this.jasmineCallback) {
        this.jasmineCallback(summary);
      }
    },

    suiteStarted: function (suite) {
      this.calc.startSuite(suite);
      this.logger.startSuite(suite, this.calc);
    },

    suiteDone: function (suite) {
      this.calc.stopSuite(suite);
      this.logger.stopSuite(suite, this.calc);
    },

    specStarted: function (spec) {
      this.calc.startSpec(spec);
      this.logger.startSpec(spec, this.calc);
    },

    specDone: function (spec) {
      this.calc.stopSpec(spec);
      this.logger.stopSpec(spec, this.calc);
    }
  };

  expose()
    .Jasmine2Reporter = Reporter;

})(this);
