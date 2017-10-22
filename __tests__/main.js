var subquest = require('../')

var options = {
  host: 'google.com'
};

describe('Bruteforce Subdomains using DNS requests', function() {

  describe('get the array of subdomains', function() {
    jest.setTimeout(20000);

    it('google.com', (done) => {
      subquest.getSubDomains(options)
      .on('end', function(result) {
        expect(Array.isArray(result)).toBe(true);
        expect(result).toContain('blog.google.com');
        done();
      })

    })

  })

})
