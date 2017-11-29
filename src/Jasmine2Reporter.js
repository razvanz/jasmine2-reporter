const Calculator = require('./Calculator');
const TerminalLogger = require('./TerminalLogger');

class Jasmine2Reporter {

  constructor(options, cb) {
    this.started = false;
    this.finished = false;
    this.loggerNo = 1;
    this.calc = new Calculator();
    this.logger = new TerminalLogger(options);
    this.jasmineCallback = cb;
  }

  jasmineStarted (runner) {
    this.started = true;
    this.calc.start(runner.totalSpecsDefined);
    this.logger.start(runner, this.calc);
  }

  jasmineDone (summary) {
    this.calc.stop();
    this.logger.stop(this.calc);
    this.finished = true;
    if (this.jasmineCallback) {
      this.jasmineCallback(summary);
    }
  }

  suiteStarted (suite) {
    this.calc.startSuite(suite);
    this.logger.startSuite(suite, this.calc);
  }

  suiteDone (suite) {
    this.calc.stopSuite(suite);
    this.logger.stopSuite(suite, this.calc);
  }

  specStarted (spec) {
    this.calc.startSpec(spec);
    this.logger.startSpec(spec);
  }

  specDone (spec) {
    this.calc.stopSpec(spec);
    this.logger.stopSpec(spec, this.calc);
  }
}

module.exports = Jasmine2Reporter;
