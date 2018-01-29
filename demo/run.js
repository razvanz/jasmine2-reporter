const Jasmine2Reporter = require('../src/Jasmine2Reporter');
const miniJasmineLib = require('minijasminenode2');

const options = {
  pendingSpec: true,
  colors: {
    pending: 'yellow',
  },
  symbols: {
    pending: '*  '.strikethrough, // strikethrough is a colors module feature
  },
};

miniJasmineLib.addSpecs('specs.js');
miniJasmineLib.addReporter(new Jasmine2Reporter(options));
miniJasmineLib.executeSpecs({
  silent: true,
});
