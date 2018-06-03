var subquest = require('../index');

var options = {
  host: 'google.com',
  dictionary: 'top_50'
};

describe('Bruteforce Subdomains using DNS requests', function () {
  // Override default timeout since operation can take long
  jest.setTimeout(10000);

  it('return error if host property is missing', function (done) {
    subquest.getSubDomains({}, err => {
      expect(err).not.toBeNull();
      done();
    });
  });

  it('has a method to get all dictionaries', () => {
    expect(subquest).toHaveProperty('getDictionaryNames');
    expect(Array.isArray(subquest.getDictionaryNames())).toBeTruthy();
  });

  it('has a method to validate DNS servers', () => {
    expect(subquest).toHaveProperty('isValidDnsServer');
  });

  it('callback with error in case of timeout', done => {
    subquest.isValidDnsServer('8.8.8.8', 1, err => {
      expect(err).not.toBeNull();
      done();
    });
  });

  it('throws an error if dictionary does not exists', done => {
    subquest.getSubDomains({
      host: 'google.com',
      dictionary: 'non-existing'
    }, err => {
      expect(err).not.toBeNull();
      done();
    });
  });

  it('allows custom dictionary to be used', done => {
    subquest.getSubDomains({
      host: 'google.com',
      dictionary: './lib/__tests__/custom-dictionary.txt'
    }, (err, result) => {
      expect(err).toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result.findIndex(o => o.hostname === 'blog.google.com')).not.toBe(-1);
      done();
    });
  });

  it('test for wildcard and return array of one element', done => {
    subquest.getSubDomains({host: 'github.com'}, (err, result) => {
      expect(err).toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('*');
      done();
    });
  });

  // Test DNS brute with google
  it('returns an array of subdomain for a existing domain', done => {
    subquest.getSubDomains(options, (err, result) => {
      expect(err).toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result.findIndex(o => o.hostname === 'blog.google.com')).not.toBe(-1);
      done();
    });
  });
});
