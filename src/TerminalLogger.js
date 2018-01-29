const configOpts = require('./configOpts');
const colors = require('colors');

class TerminalLogger {
  constructor(options) {
    this.options = configOpts(options);
    this.indentLevel = 0;
    this.lastNewLine = false;
    this.failedSpecs = [];
  }

  start() {
    this.print(colors.bold.inverse('\n JASMINE STARTING: \n'));
  }

  stop(calc) {
    if (this.options.summary) this.summary(calc);
    if (this.options.failuresSummary &&
      (calc.failedSpecs > 0)) this.failuresSummary(calc);
  }

  failuresSummary() {
    this.resetIndent();
    this.newLine(true);
    this.print('**************************************************');
    this.print(`*                   ${colors.bold.inverse(' Failures ')
    }                   *`);
    this.print('**************************************************');
    this.newLine();
    for (let i = 0; i < this.failedSpecs.length; i++) {
      this.failedSummary(this.failedSpecs[i], i + 1);
      this.newLine();
    }
  }

  failedSummary(spec, index) {
    this.print(`${index}) ${colors.bold(spec.fullName)}`);
    this.displayErrorMessages(spec, true);
  }

  displayErrorMessages(spec, isSummary) {
    this.increaseIndent();
    const assertions = spec.failedExpectations;
    for (let i = 0; i < assertions.length; i++) {
      if (!assertions[i].passed) {
        this.print('- '.failed + assertions[i].message.failed);
        if (this.options.stacktrace && isSummary && assertions[i].stack) {
          this.print(this.filterStackTraces(assertions[i].stack)
            .failed);
        }
      }
    }
    this.decreaseIndent();
  }

  filterStackTraces(traces) {
    const lines = traces.split('\n');
    const filtered = [];
    for (let i = 1; i < lines.length; i++) {
      if (!/(jasmine[^/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
        filtered.push(lines[i]);
      }
    }
    return filtered.join('\n');
  }

  summary(calc) {
    const execution = 'Executed '.system + (`${calc.executedSpecs}`)
      .strikethrough + ' out of '.system +
      (`${calc.totalSpecs}`)
        .strikethrough +
      (calc.totalSpecs === 1 ? ' spec '.system : ' specs '.system) +
      'in '.system + calc.runTime.system;
    const passed = `PASSED   ${calc.passedSpecs} (${
      calc.formatPercentage(calc.passedSpecs, calc.totalSpecs)})`;
    const failed = `FAILED   ${calc.failedSpecs} (${
      calc.formatPercentage(calc.failedSpecs, calc.totalSpecs)})`;
    const pending = `SKIPPED  ${calc.pendingSpecs} (${
      calc.formatPercentage(calc.pendingSpecs, calc.totalSpecs)})`;
    this.resetIndent();
    this.newLine(true);
    this.print('**************************************************');
    this.print(`*                   ${colors.bold.inverse(' Summary ')
    }                    *`);
    this.print('**************************************************');
    this.newLine();
    this.print(execution.italic);
    this.newLine();
    this.increaseIndent();
    if (calc.passedSpecs > 0 || !this.options.hideEmptySummary) { this.print(passed.passed); }
    if (calc.failedSpecs > 0 || !this.options.hideEmptySummary) { this.print(failed.failed); }
    if (calc.pendingSpecs > 0 || !this.options.hideEmptySummary) { this.print(pending.pending); }
    this.decreaseIndent();
    this.newLine();
  }

  startSuite(suite) {
    this.newLine();
    this.increaseIndent();
    this.print(this.options.symbols.suite.suite + this.getSuiteName(suite, 'suite'));
  }

  stopSuite(suite, calc) {
    if (calc.suites[suite.id].status === 'skip') {
      this.pendingSuite(suite, calc);
    } else if (this.options.suiteDuration) {
      this.suiteDetails(suite, calc);
    } else {
      this.decreaseIndent();
      this.newLine();
    }
    delete calc.suites[suite.id]; // prevent memory leak
  }

  pendingSuite(suite) {
    if (this.options.pendingSuite) {
      this.increaseIndent();
      this.print(this.options.symbols.pending.pending + this.getSuiteName(suite, 'pending'));
      this.decreaseIndent();
    }
  }

  suiteDetails(suite, calc) {
    this.print('  Finished '.system + this.getSuiteName(suite, 'suite') +
      ' in '.system + calc.suites[suite.id].duration.system);
    this.decreaseIndent();
    this.newLine();
  }

  startSpec(spec) {
    this.increaseIndent();
    if (this.options.startingSpec) {
      this.print(this.options.symbols.starting.starting + this.getSpecName(spec));
    }
  }

  stopSpec(spec, calc) {
    this[spec.status](spec, calc);
    this.decreaseIndent();
  }

  passed(spec, calc) {
    if (this.options.passedSpec) {
      const duration = this.options.specDuration ? ` (${calc.specTime})` : '';
      this.print(this.options.symbols.passed.passed + this.getSpecName(spec, 'passed') + duration.system);
    }
  }

  failed(spec, calc) {
    this.failedSpecs.push(spec);
    if (this.options.failedSpec) {
      const duration = this.options.specDuration ? ` (${calc.specTime})` : '';
      this.print(this.options.symbols.failed.failed + this.getSpecName(spec, 'failed') + duration.system);
      if (this.options.failedAsserts) { this.displayErrorMessages(spec, false); }
    }
  }

  pending(spec) {
    if (this.options.pendingSpec) {
      this.print(this.options.symbols.pending.pending + this.getSpecName(spec, 'pending'));
    }
  }

  disabled(spec) {
    if (this.options.disabledSpec) {
      this.print(this.options.symbols.disabled.disabled + this.getSpecName(spec, 'system'));
    }
  }

  getSuiteName(suite, color) {
    return this.options.namesInColors ? colors.bold[color](suite.description) : colors.bold(suite.description);
  }

  getSpecName(spec, color) {
    return this.options.namesInColors ? spec.description[color] : spec.description;
  }

  print(stuff) {
    if (!this.options.inColors) {
      stuff = (`${stuff}`)
        .replace(/\x1B\[\d+m/g, ''); // eslint-disable-line no-control-regex
    }
    console.log(this.createIndent() + stuff); // eslint-disable-line no-console
    this.lastNewLine = false;
  }

  newLine(force) {
    if (!this.lastNewLine || force) {
      console.log(''); // eslint-disable-line no-console
      this.lastNewLine = true;
    }
  }

  createIndent() {
    return (new Array(this.indentLevel)
      .join(this.options.indent))
      .toString();
  }

  increaseIndent() {
    this.indentLevel++;
  }

  decreaseIndent() {
    this.indentLevel--;
  }

  resetIndent() {
    this.indentLevel = 1;
  }
}

module.exports = TerminalLogger;
