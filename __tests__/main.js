var subquest = require('../')

var options = {
  host: 'google.com'
};

describe('Bruteforce Subdomains using DNS requests', function() {

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
