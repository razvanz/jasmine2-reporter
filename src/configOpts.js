const colors = require('colors');

const DEFAULTS = Object.freeze({
  failedAsserts: true,
  failedSpec: true,
  failuresSummary: true,
  hideEmptySummary: false,
  inColors: colors.supportsColor,
  indent: '\t',
  namesInColors: false,
  startingSpec: false,
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
    system: 'grey',
  },
  symbols: {
    failed: colors.strikethrough('X  '),
    passed: colors.strikethrough('√  '),
    pending: colors.strikethrough('~  '),
    disabled: colors.strikethrough('#  '),
    suite: colors.strikethrough('»  '),
    starting: colors.strikethrough('▻  '),
  },
});

function configOpts(options) {
  options = options || {};

  options.indent = 'indent' in options ? options.indent : DEFAULTS.indent;
  options.failedAsserts = 'failedAsserts' in options ? options.failedAsserts : DEFAULTS.failedAsserts;
  options.failedSpec = 'failedSpec' in options ? options.failedSpec : DEFAULTS.failedSpec;
  options.failuresSummary = 'failuresSummary' in options ? options.failuresSummary : DEFAULTS.failuresSummary;
  options.passedSpec = 'passedSpec' in options ? options.passedSpec : DEFAULTS.passedSpec;
  options.disabledSpec = 'disabledSpec' in options ? options.disabledSpec : DEFAULTS.disabledSpec;
  options.pendingSpec = 'pendingSpec' in options ? options.pendingSpec : DEFAULTS.pendingSpec;
  options.pendingSuite = 'pendingSuite' in options ? options.pendingSuite : DEFAULTS.pendingSuite;
  options.specDuration = 'specDuration' in options ? options.specDuration : DEFAULTS.specDuration;
  options.stacktrace = 'stacktrace' in options ? options.stacktrace : DEFAULTS.stacktrace;
  options.suiteDuration = 'suiteDuration' in options ? options.suiteDuration : DEFAULTS.suiteDuration;
  options.summary = 'summary' in options ? options.summary : DEFAULTS.summary;
  options.hideEmptySummary = 'hideEmptySummary' in options ? options.hideEmptySummary : DEFAULTS.hideEmptySummary;
  options.inColors = 'inColors' in options ? options.inColors : DEFAULTS.inColors;
  options.namesInColors = 'namesInColors' in options ? options.namesInColors : DEFAULTS.namesInColors;
  options.startingSpec = 'startingSpec' in options ? options.startingSpec : DEFAULTS.startingSpec;

  options.symbols = {
    passed: options.symbols && options.symbols.passed !== undefined ?
      colors.strikethrough(options.symbols.passed) : DEFAULTS.symbols.passed,
    failed: options.symbols && options.symbols.failed !== undefined ?
      colors.strikethrough(options.symbols.failed) : DEFAULTS.symbols.failed,
    pending: options.symbols && options.symbols.pending !== undefined ?
      colors.strikethrough(options.symbols.pending) : DEFAULTS.symbols.pending,
    disabled: options.symbols && options.symbols.disabled !== undefined ?
      colors.strikethrough(options.symbols.disabled) : DEFAULTS.symbols.disabled,
    suite: options.symbols && options.symbols.suite !== undefined ?
      colors.strikethrough(options.symbols.suite) : DEFAULTS.symbols.suite,
    starting: options.symbols && options.symbols.starting !== undefined ?
      colors.strikethrough(options.symbols.starting) : DEFAULTS.symbols.starting,
  };

  colors.setTheme({
    passed: options.colors && options.colors.passed ?
      options.colors.passed : DEFAULTS.colors.passed,
    failed: options.colors && options.colors.failed ?
      options.colors.failed : DEFAULTS.colors.failed,
    pending: options.colors && options.colors.pending ?
      options.colors.pending : DEFAULTS.colors.pending,
    disabled: options.colors && options.colors.disabled ?
      options.colors.disabled : DEFAULTS.colors.system,
    suite: options.colors && options.colors.suite ?
      options.colors.suite : DEFAULTS.colors.suite,
    starting: options.colors && options.colors.system ?
      options.colors.system : DEFAULTS.colors.system,
    system: options.colors && options.colors.system ?
      options.colors.system : DEFAULTS.colors.system,
  });

  return options;
}

module.exports = configOpts;
