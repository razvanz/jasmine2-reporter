Jasmine 2.0 Terminal Reporter
=============================

A cool, very customisable, terminal reporter for visualizing `Jasmine 2.0` test results.

Usage
-----

In most cases if a reference to the `jasmine` object is defined, the reporter can be added using the test runner api:

```javascript
jasmine.getEnv().addReporter(reporter);
```

#### NodeJS (`minijasminenode2`\)

This example is based on [minijasminenode2](https://github.com/juliemr/minijasminenode/tree/jasmine2) library. The reporter can be used with other Jasmine plugins. Check the appropriate documentation for usage details.

```javascript
var miniJasmineLib = require('minijasminenode2'),
  TestsReporter = require('jasmine2-reporter').Jasmine2Reporter,
  options = {
    pendingSpec: false,
    colors: {
      pending: 'orange',
    },
    symbols: {
      pending: '*  '.strikethrough, //strikethrough is a colors module feature
    }
  };

  miniJasmineLib.addReporter(new TestsReporter(options));
```

Options
-------

-	`failedAsserts: true` - display the asserts that failed with the failed specs;
-	`failedSpec: true` - display failed specs;
-	`failuresSummary: true` - display a summary with the failed specs;
-	`hideEmptySummary: false` - hide passed/failed/pending in the summary if the corresponding tests number is 0;
-	`inColors: true` - use colors to display the reports;
-	`indent: '\t'` - the indentation character/string;
-	`namesInColors: false` - display suite and specs names in colors;
-	`startingSpec: false` - display started specs;
-	`passedSpec: true` - display passed specs;
-	`pendingSpec: true` - display pending/skipped specs (`xit`, `pending()`);
-	`pendingSuite: true` - display pending/skipped suites (`xdescribe`);
-	`specDuration: true` - display test duration for each spec;
-	`stacktrace: true` - display stack traces for failed specs;
-	`suiteDuration: false` - display duration for each suite;
-	`summary: true` - display a summary with passed/failed/pending percentages, after all the test have runned;
-	`colors`
	-	`starting: 'grey'` - color used to display started tests;
	-	`failed: 'red'` - color used to display failed tests;
	-	`passed: 'green'` - color used to display passed tests;
	-	`pending: 'yellow'` - color used to display pending(skipped) tests;
	-	`suite: 'cyan'` - color used to display suite symbol/name;
	-	`system: 'grey'` - color used to display system information (duration, summary, ...);
-	`symbols`
	-	`starting: '▻  '.strikethrough` - spec started symbol;
	-	`failed: '✗  '.strikethrough` - failed spec symbol;
	-	`passed: '✓  '.strikethrough` - passed spec symbol;
	-	`pending: '~  '.strikethrough` - pending(skipped) spec symbol;
	-	`disabled: '#  '.strikethrough` - disabled spec symbol;
	-	`suite: '» '.strikethrough` - suite symbol;

*Note:* By default the symbols are emphasized with strikethrough wich is a [colors](https://www.npmjs.org/package/colors) module feature. The dependancy is used for displaying the colored output, so for more options check their [documentation](https://github.com/Marak/colors.js/blob/master/ReadMe.md).

Changelog
---------

-	**v0.1.2**
	-	Fix [#11](https://github.com/razvanz/jasmine2-reporter/pull/11) - Avoid reported crashing on `disabled` specs
-	**v0.1.1**
	-	Fix [#1](https://github.com/razvanz/jasmine2-reporter/issues/1) - documentation
	-	Fix [#4](https://github.com/razvanz/jasmine2-reporter/issues/4) - NaN on summary
	-	Fix [#5](https://github.com/razvanz/jasmine2-reporter/issues/5) - error on undefined stack
	-	Fix [#6](https://github.com/razvanz/jasmine2-reporter/issues/6) - added `hideEmptySummary` option
-	**v0.1.0** (initial functionality)
	-	terminal reported compatible with `Jasmine 2.0`

LICENCE
-------

[MIT](https://github.com/razvanz/jasmine2-reporter/blob/master/LICENSE)

Screenshots
-----------

![](https://github.com/razvanz/jasmine2-reporter/blob/master/screenshots/1.png) ![](https://github.com/razvanz/jasmine2-reporter/blob/master/screenshots/2.png) ![](https://github.com/razvanz/jasmine2-reporter/blob/master/screenshots/3.png)
