var miniJasmineLib = require('minijasminenode2'),
  TestsReporter = require('../index').Jasmine2Reporter,
  options = {
    pendingSpec: false,
    colors: {
      pending: 'yellow',
    },
    symbols: {
      pending: '*  '.strikethrough, //strikethrough is a colors module feature
    }
  };

miniJasmineLib.addSpecs('demo/specs.js');
miniJasmineLib.addReporter(new TestsReporter(options));
miniJasmineLib.executeSpecs({})
