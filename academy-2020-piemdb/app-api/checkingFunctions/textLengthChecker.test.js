const { textLengthChecker } = require('./textLengthChecker');

describe('/app-api/checkingFunctions/textLengthChecker.js', () => {
  it('should return false for an input that is too long', () => {
    const output = textLengthChecker(15, 10);
    expect(output).toBe(false);
  });

  it('should return true for an input that is short', () => {
    const output = textLengthChecker(5, 10);
    expect(output).toBe(true);
  });
});
