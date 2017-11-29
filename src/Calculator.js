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

  start (specNo) {
    this.startTime = (new Date()).getTime();
    this.totalSpecs = specNo;
  }

  stop () {
    this.runTime = this.formatDuration((new Date()).getTime() - this.startTime);
    this.executedSpecs = this.failedSpecs + this.passedSpecs;
    this.pendingSpecs = this.totalSpecs - this.executedSpecs;
  }

  startSuite (suite) {
    this.suites[suite.id] = {
      status: 'exec',
      startTime: (new Date()).getTime()
    };
  }

  stopSuite (suite) {
    this.totalSuites++;
    if (this.suites[suite.id]) {
      this.suites[suite.id].duration = this.formatDuration((new Date()).getTime() - this.suites[suite.id].startTime);
      this.executedSuites++;
    } else {
      this.suites[suite.id] = {
        status: 'skip',
        startTime: (new Date()).getTime(),
        duration: this.formatDuration(0)
      };
    }
  }

  startSpec () {
    this.specStartTime = (new Date()).getTime();
  }

  stopSpec (spec) {
    this.specTime = this.formatDuration((new Date()).getTime() - this.specStartTime);
    this.countSpecs(spec.status);
  }

  countSpecs (status) {
    switch (status) {
      case 'passed':
        this.passedSpecs++;
        break;
      case 'failed':
        this.failedSpecs++;
        break;
    }
  }

  formatDuration (durationInMs) {
    let duration = '', durationInSecs, durationInMins, durationInHrs;
    durationInSecs = durationInMs / 1000;
    if (durationInSecs < 1) {
      return (durationInSecs + ' s').strikethrough;
    }
    durationInSecs = Math.round(durationInSecs);
    if (durationInSecs < 60) {
      return (durationInSecs + ' s').strikethrough;
    }
    durationInMins = Math.floor(durationInSecs / 60);
    durationInSecs = durationInSecs % 60;
    if (durationInSecs) {
      duration = ' ' + durationInSecs + ' s';
    }
    if (durationInMins < 60) {
      return (durationInMins + ' min' + duration).strikethrough;
    }
    durationInHrs = Math.floor(durationInMins / 60);
    durationInMins = durationInMins % 60;
    if (durationInMins) {
      duration = ' ' + durationInMins + ' min' + duration;
    }
    return (durationInHrs + ' hours' + duration).strikethrough;
  }

  formatPercentage (unit, total) {
    if(total !== 0){
      return ' ' + (parseInt(unit * 10000 / total) / 100) + '% ';
    } else return '0 %';
  }
}

module.exports = Calculator;
