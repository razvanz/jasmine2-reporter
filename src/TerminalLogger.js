(function (global) {

  'use strict';

  var colors = require('colors'),
    DEFAULTS = {
      failedAsserts: true,
      failedSpec: true,
      failuresSummary: true,
      hideEmptySummary: false,
      inColors: true,
      indent: '\t',
      namesInColors: false,
      passedSpec: true,
      disabledSpec: true,
      pendingSpec: true,
      pendingSuite: true,
      specDuration: true,
      stacktrace: true,
      suiteDuration: false,
      summary: true,
      colors: {
        failed: 'red',
        passed: 'green',
        pending: 'yellow',
        suite: 'cyan',
        system: 'grey'
      },
      symbols: {
        failed: '✗  '.strikethrough,
        passed: '✓  '.strikethrough,
        pending: '~  '.strikethrough,
        disabled: '#  '.strikethrough,
        suite: '» '.strikethrough
      }
    };

  function configOpts(opts) {
    opts = opts || {};

    opts.indent = 'indent' in opts ? opts.indent : DEFAULTS.indent;
    opts.failedAsserts = 'failedAsserts' in opts ?
      opts.failedAsserts : DEFAULTS.failedAsserts;
    opts.failedSpec = 'failedSpec' in opts ?
      opts.failedSpec : DEFAULTS.failedSpec;
    opts.failuresSummary = 'failuresSummary' in opts ?
      opts.failuresSummary : DEFAULTS.failuresSummary;
    opts.passedSpec = 'passedSpec' in opts ?
      opts.passedSpec : DEFAULTS.passedSpec;
    opts.disabledSpec = 'disabledSpec' in opts ?
      opts.disabledSpec : DEFAULTS.disabledSpec;
    opts.pendingSpec = 'pendingSpec' in opts ?
      opts.pendingSpec : DEFAULTS.pendingSpec;
    opts.pendingSuite = 'pendingSuite' in opts ?
      opts.pendingSuite : DEFAULTS.pendingSuite;
    opts.specDuration = 'specDuration' in opts ?
      opts.specDuration : DEFAULTS.specDuration;
    opts.stacktrace = 'stacktrace' in opts ?
      opts.stacktrace : DEFAULTS.stacktrace;
    opts.suiteDuration = 'suiteDuration' in opts ?
      opts.suiteDuration : DEFAULTS.suiteDuration;
    opts.summary = 'summary' in opts ? opts.summary : DEFAULTS.summary;
    opts.hideEmptySummary = 'hideEmptySummary' in opts ? opts.hideEmptySummary :
      DEFAULTS.hideEmptySummary;
    opts.inColors = 'inColors' in opts ? opts.inColors : DEFAULTS.inColors;
    opts.namesInColors = 'namesInColors' in opts ?
      opts.namesInColors : DEFAULTS.namesInColors;

    opts.symbols = {
      passed: opts.symbols && opts.symbols.passed !== undefined ?
        opts.symbols.passed.strikethrough : DEFAULTS.symbols.passed,
      failed: opts.symbols && opts.symbols.failed !== undefined ?
        opts.symbols.failed.strikethrough : DEFAULTS.symbols.failed,
      pending: opts.symbols && opts.symbols.pending !== undefined ?
        opts.symbols.pending.strikethrough : DEFAULTS.symbols.pending,
      disabled: opts.symbols && opts.symbols.disabled !== undefined ?
        opts.symbols.disabled.strikethrough : DEFAULTS.symbols.disabled,
      suite: opts.symbols && opts.symbols.suite !== undefined ?
        opts.symbols.suite.strikethrough : DEFAULTS.symbols.suite
    };

    colors.setTheme({
      passed: opts.colors && opts.colors.passed ?
        opts.colors.passed : DEFAULTS.colors.passed,
      failed: opts.colors && opts.colors.failed ?
        opts.colors.failed : DEFAULTS.colors.failed,
      pending: opts.colors && opts.colors.pending ?
        opts.colors.pending : DEFAULTS.colors.pending,
      disabled: opts.colors && opts.colors.disabled ?
        opts.colors.disabled : DEFAULTS.colors.system,
      suite: opts.colors && opts.colors.suite ?
        opts.colors.suite : DEFAULTS.colors.suite,
      system: opts.colors && opts.colors.system ?
        opts.colors.system : DEFAULTS.colors.system
    });

    return opts;
  }

  var TerminalLogger = function (options) {
    this.options = configOpts(options);
    this.indentLevel = 0;
    this.lastNewLine = false;
    this.failedSpecs = [];
  };

  TerminalLogger.prototype = {
    start: function () {
      this.print('\n JASMINE STARTING: \n'.bold.inverse);
    },
    stop: function (errors, calc) {
      if (this.options.summary) this.summary(calc);
      if (this.options.failuresSummary &&
        (calc.failedSpecs > 0)) this.failuresSummary(calc);
    },
    failuresSummary: function () {
      this.resetIndent();
      this.newLine(true);
      this.print('**************************************************');
      this.print('*                   ' + ' Failures '.bold.inverse +
        '                   *');
      this.print('**************************************************');
      this.newLine();
      for (var i = 0; i < this.failedSpecs.length; i++) {
        this.failedSummary(this.failedSpecs[i], i + 1);
        this.newLine();
      }
    },
    failedSummary: function (spec, index) {
      this.print(index + ') ' + spec.fullName.bold);
      this.displayErrorMessages(spec, true);
    },
    displayErrorMessages: function (spec, isSummary) {
      this.increaseIndent();
      var assertions = spec.failedExpectations;
      for (var i = 0; i < assertions.length; i++) {
        if (!assertions[i].passed) {
          this.print('- '.failed + assertions[i].message.failed);
          if (this.options.stacktrace && isSummary && assertions[i].stack) {
            this.print(this.filterStackTraces(assertions[i].stack)
              .failed);
          }
        }
      }
      this.decreaseIndent();
    },
    filterStackTraces: function (traces) {
      var lines = traces.split('\n');
      var filtered = [];
      for (var i = 1; i < lines.length; i++) {
        if (!/(jasmine[^\/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
          filtered.push(lines[i]);
        }
      }
      return filtered.join('\n');
    },
    summary: function (calc) {
      var execution = 'Executed '.system + ('' + calc.executedSpecs)
        .strikethrough + ' out of '.system +
        ('' + calc.totalSpecs)
        .strikethrough +
        (calc.totalSpecs === 1 ? ' spec '.system : ' specs '.system) +
        'in '.system + calc.runTime.system,
        passed = 'PASSED   ' + calc.passedSpecs + ' (' +
        calc.formatProcentage(calc.passedSpecs, calc.totalSpecs) + ')',
        failed = 'FAILED   ' + calc.failedSpecs + ' (' +
        calc.formatProcentage(calc.failedSpecs, calc.totalSpecs) + ')',
        pending = 'SKIPPED  ' + calc.pendingSpecs + ' (' +
        calc.formatProcentage(calc.pendingSpecs, calc.totalSpecs) + ')';
      this.resetIndent();
      this.newLine(true);
      this.print('**************************************************');
      this.print('*                   ' + ' Summary '.bold.inverse +
        '                    *');
      this.print('**************************************************');
      this.newLine();
      this.print(execution.italic);
      this.newLine();
      this.increaseIndent();
      if (calc.passedSpecs > 0 || !this.options.hideEmptySummary)
        this.print(passed.passed);
      if (calc.failedSpecs > 0 || !this.options.hideEmptySummary)
        this.print(failed.failed);
      if (calc.pendingSpecs > 0 || !this.options.hideEmptySummary)
        this.print(pending.pending);
      this.decreaseIndent();
      this.newLine();
    },
    startSuite: function (suite) {
      this.newLine();
      this.increaseIndent();
      this.print(this.options.symbols.suite.suite +
        this.getSuiteName(suite, 'suite'));
    },
    stopSuite: function (suite, calc) {
      if (calc.suites[suite.id].status === 'skip') {
        this.pendingSuite(suite, calc);
      } else if (this.options.suiteDuration) {
        this.suiteDetails(suite, calc);
      } else {
        this.decreaseIndent();
        this.newLine();
      }
      delete calc.suites[suite.id]; // prevent memory leak
    },
    pendingSuite: function (suite) {
      if (this.options.pendingSuite) {
        this.increaseIndent();
        this.print(this.options.symbols.pending.pending +
          this.getSuiteName(suite, 'pending'));
        this.decreaseIndent();
      }
    },
    suiteDetails: function (suite, calc) {
      this.print('  Finished '.system + this.getSuiteName(suite, 'suite') +
        ' in '.system + calc.suites[suite.id].duration.system);
      this.decreaseIndent();
      this.newLine();
    },
    startSpec: function () {
      this.increaseIndent();
    },
    stopSpec: function (spec, calc) {
      this[spec.status](spec, calc);
      this.decreaseIndent();
    },
    passed: function (spec, calc) {
      if (this.options.passedSpec) {
        var duration = this.options.specDuration ?
          ' (' + calc.specTime + ')' : '';
        this.print(this.options.symbols.passed.passed +
          this.getSpecName(spec, 'passed') + duration.system);
      }
    },
    failed: function (spec, calc) {
      this.failedSpecs.push(spec);
      if (this.options.failedSpec) {
        var duration = this.options.specDuration ?
          ' (' + calc.specTime + ')' : '';
        this.print(this.options.symbols.failed.failed +
          this.getSpecName(spec, 'failed') + duration.system);
        if (this.options.failedAsserts)
          this.displayErrorMessages(spec, false);
      }
    },
    pending: function (spec) {
      if (this.options.pendingSpec) {
        this.print(this.options.symbols.pending.pending +
          this.getSpecName(spec, 'pending'));
      }
    },
    disabled: function (spec) {
      if (this.options.disabledSpec) {
        this.print(this.options.symbols.disabled.disabled +
          this.getSpecName(spec, 'system'));
      }
    },
    getSuiteName: function (suite, color) {
      return this.options.namesInColors ?
        suite.description.bold[color] : suite.description.bold;
    },
    getSpecName: function (spec, color) {
      return this.options.namesInColors ?
        spec.description[color] : spec.description;
    },
    print: function (stuff) {
      if (!this.options.inColors) {
        stuff = ('' + stuff)
          .replace(/\x1B\[\d+m/g, '');
      }
      console.log(this.createIndent() + stuff);
      this.lastNewLine = false;
    },
    newLine: function (force) {
      if (!this.lastNewLine || force) {
        console.log('');
        this.lastNewLine = true;
      }
    },
    createIndent: function () {
      return (new Array(this.indentLevel)
          .join(this.options.indent))
        .toString();
    },
    increaseIndent: function () {
      this.indentLevel++;
    },
    decreaseIndent: function () {
      this.indentLevel--;
    },
    resetIndent: function () {
      this.indentLevel = 1;
    }
  };

  function expose() {
    if (typeof module !== 'undefined' && module.exports) {
      return exports;
    } else {
      global.reporterHelpers = global.reporterHelpers || {};
      return global.reporterHelpers;
    }
  }

  expose()
    .TerminalLogger = TerminalLogger;
})(this);
