const each = require('jest-each').default;
const {
  urlChecker,
} = require('./urlChecker');

describe('/app-api/checkingFunctions/urlChecker.js', () => {
  each([
    [
      'piemdb.infinipie.works/',
    ],
    [
      'http://piemdb. infinipie.works/',
    ],
    [
      'I\'m Slim Shady yes I\'m the real Shady',
    ],
  ]).it('should return false for an invalid url', (url) => {
    const output = urlChecker(url);
    expect(output).toBe(false);
  });

  it('should return true for a valid url', () => {
    const output = urlChecker('http://piemdb.infinipie.works/');
    expect(output).toBe(true);
  });
});
