var subquest = require('../index');

var options = {
  host: 'google.com'
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
    expect(Array.isArray(subquest.getDictionaryNames())).toBeTruthy();
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
      expect(result).toContain('blog.google.com');
      done();
    });
  });
});
