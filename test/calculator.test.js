const Calculator = require('../src/Calculator');

describe('Tests for Calculator class', () => {
  describe('checks for duration()', () => {
    const calculator = new Calculator();

    describe('checks the method returns duration in sec', () => {
      const lessSec = calculator.duration(500);
      const round = calculator.duration(1926);
      const lessMin = calculator.duration(59000);

      test('validates the returns value if ms parameter < 1 sec', () => {
        expect(lessSec).toEqual(expect.stringContaining('0.5 s'));
      });

      test('validates the returns value is rounded', () => {
        expect(round).toEqual(expect.stringContaining('2 s'));
      });

      test('validates the returns value if ms parameter < 60 sec', () => {
        expect(lessMin).toEqual(expect.stringContaining('59 s'));
      });
    });

    describe('checks the method returns duration in min', () => {
      const min = calculator.duration(60000);
      const minWithSec = calculator.duration(65300);
      const lessHour = calculator.duration(3500000);

      test('validates the returns value if duration is 1 min', () => {
        expect(min).toEqual(expect.stringContaining('1 min'));
      });

      test('validates the returns value if duration is more than one min', () => {
        expect(minWithSec).toEqual(expect.stringContaining('1 min 5 s'));
      });

      test('validates the returns value if duration is less than one hour', () => {
        expect(lessHour).toEqual(expect.stringContaining('58 min 20 s'));
      });
    });

    describe('checks the method returns duration in hour', () => {
      const hour = calculator.duration(6000000);
      const hourWithMin = calculator.duration(38523654);

      test('validates the returns value if duration is 1 hour', () => {
        expect(hour).toEqual(expect.stringContaining('1 hours'));
      });

      test('validates the returns value if duration is more than one hour', () => {
        expect(hourWithMin).toEqual(expect.stringContaining('10 hours 42 min 4 s'));
      });
    })
  });

  describe('checks for formatPercentage()', () => {
    const calculator = new Calculator();
    const zero = calculator.formatPercentage(10, 0);
    const notZero = calculator.formatPercentage(5, 10);

    test('validates the returns value is zero', () => {
      expect(zero).toEqual(expect.stringContaining('0 %'));
    });

    test('validates the returns value is not zero', () => {
      expect(notZero).toEqual(expect.stringContaining(' 50% '));
    });
  });
});
