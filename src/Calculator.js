(function (global) {

  'use strict';

  var Calculator = function () {
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
  };

  Calculator.prototype = {
    start: function (specNo) {
      this.startTime = (new Date())
        .getTime();
      this.totalSpecs = specNo;
    },
    stop: function () {
      this.runTime = this.formatDuration((new Date())
        .getTime() - this.startTime);
      this.executedSpecs = this.failedSpecs + this.passedSpecs;
      this.pendingSpecs = this.totalSpecs - this.executedSpecs;
    },
    startSuite: function (suite) {
      this.suites[suite.id] = {
        status: 'exec',
        startTime: (new Date())
          .getTime()
      };
    },
    stopSuite: function (suite) {
      this.totalSuites++;
      if (this.suites[suite.id]) {
        this.suites[suite.id].duration = this.formatDuration((new Date())
          .getTime() - this.suites[suite.id].startTime);
        this.executedSuites++;
      } else {
        this.suites[suite.id] = {
          status: 'skip',
          startTime: (new Date())
            .getTime(),
          duration: this.formatDuration(0)
        };
      }
    },
    startSpec: function () {
      this.specStartTime = (new Date())
        .getTime();
    },
    stopSpec: function (spec) {
      this.specTime = this.formatDuration((new Date())
        .getTime() - this.specStartTime);
      this.countSpecs(spec.status);
    },
    countSpecs: function (status) {
      switch (status) {
      case 'passed':
        this.passedSpecs++;
        break;
      case 'failed':
        this.failedSpecs++;
        break;
      }
    },
    formatDuration: function (durationInMs) {
      var duration = '',
        durationInSecs, durationInMins, durationInHrs;
      durationInSecs = durationInMs / 1000;
      if (durationInSecs < 1) {
        return (durationInSecs + ' s')
          .strikethrough;
      }
      durationInSecs = Math.round(durationInSecs);
      if (durationInSecs < 60) {
        return (durationInSecs + ' s')
          .strikethrough;
      }
      durationInMins = Math.floor(durationInSecs / 60);
      durationInSecs = durationInSecs % 60;
      if (durationInSecs) {
        duration = ' ' + durationInSecs + ' s';
      }
      if (durationInMins < 60) {
        return (durationInMins + ' min' + duration)
          .strikethrough;
      }
      durationInHrs = Math.floor(durationInMins / 60);
      durationInMins = durationInMins % 60;
      if (durationInMins) {
        duration = ' ' + durationInMins + ' min' + duration;
      }
      return (durationInHrs + ' hours' + duration)
        .strikethrough;
    },
    formatProcentage: function (unit, total) {
      return ' ' + (parseInt(unit * 10000 / total) / 100) + '% ';
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
    .Calculator = Calculator;

})(this);
