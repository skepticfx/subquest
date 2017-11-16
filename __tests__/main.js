var subquest = require('../')

var options = {
  host: 'google.com'
};

describe('Bruteforce Subdomains using DNS requests', function() {
  it('return error if host property is missing', function(done) {
    subquest.getSubDomains({}, (err, result) => {
      expect(err).not.toBeNull();
      done();
    });
  });

  describe('get the array of subdomains', function() {
    // Override default timeout since operation can take long
    jest.setTimeout(20000);
    // Test DNS brute with google
    it('google.com', (done) => {
      subquest.getSubDomains(options, (err, result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result).toContain('blog.google.com');
        done();
      })
    })

  })

})
