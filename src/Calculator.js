const colors = require('colors/safe');

class Calculator {
  constructor() {
    this.startTime = null;
    this.specStartTime = null;
    this.runTime = null;
    this.specTime = null;
    this.passedSpecs = 0;
    this.failedSpecs = 0;
    this.pendingSpecs = 0;
    this.executedSpecs = 0;
    this.executedSuites = 0;
    this.totalSuites = 0;
    this.totalSpecs = 0;
    this.suites = {};
  }

  start(specNo) {
    this.startTime = (new Date()).getTime();
    this.totalSpecs = specNo;
  }

  stop() {
    this.runTime = this.duration((new Date()).getTime() - this.startTime);
    colors.strikethrough(this.runTime);
    this.executedSpecs = this.failedSpecs + this.passedSpecs;
    this.pendingSpecs = this.totalSpecs - this.executedSpecs;
  }

  startSuite(suite) {
    this.suites[suite.id] = {
      status: 'exec',
      startTime: (new Date()).getTime(),
    };
  }

  stopSuite(suite) {
    this.totalSuites++;
    if (this.suites[suite.id]) {
      this.suites[suite.id].duration = this.duration((new Date()).getTime() - this.suites[suite.id].startTime);
      colors.strikethrough(this.suites[suite.id].duration);
      this.executedSuites++;
    } else {
      this.suites[suite.id] = {
        status: 'skip',
        startTime: (new Date()).getTime(),
        duration: this.duration(0),
      };
    }
  }

  startSpec() {
    this.specStartTime = (new Date()).getTime();
  }

  stopSpec(spec) {
    this.specTime = this.duration((new Date()).getTime() - this.specStartTime);
    colors.strikethrough(this.specTime);
    this.countSpecs(spec.status);
  }

  countSpecs(status) {
    switch (status) {
      case 'passed':
        this.passedSpecs++;
        break;
      case 'failed':
        this.failedSpecs++;
        break;
    }
  }

  duration(durationInMs) {
    let duration = '';
    let durationInSecs;
    let durationInMins;
    let durationInHrs;
    durationInSecs = durationInMs / 1000;
    if (durationInSecs < 1) {
      return `${durationInSecs} s`;
    }
    durationInSecs = Math.round(durationInSecs);
    if (durationInSecs < 60) {
      return `${durationInSecs} s`;
    }
    durationInMins = Math.floor(durationInSecs / 60);
    durationInSecs %= 60;
    if (durationInSecs) {
      duration = ` ${durationInSecs} s`;
    }
    if (durationInMins < 60) {
      return `${durationInMins} min${duration}`;
    }
    durationInHrs = Math.floor(durationInMins / 60);
    durationInMins %= 60;
    if (durationInMins) {
      duration = ` ${durationInMins} min${duration}`;
    }
    return `${durationInHrs} hours${duration}`;
  }

  formatPercentage(unit, total) {
    if (total !== 0) {
      return ` ${parseInt(unit * 10000 / total) / 100}% `;
    } return '0 %';
  }
}

module.exports = Calculator;
