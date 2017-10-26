var subquest = require('../index.js')

describe('DNS Servers', function() {

  // Override default jest timeout
  beforeAll(function() {
    jest.setTimeout(5000)
  })

  describe('test valid DNS server before adding to resolvers', function() {
  
    // Google DNS servers
    var server = '8.8.8.8';
  
    it('returns success if the DNS server is valid', function(done) {
      subquest.isValidDnsServer(server, function(err) {
        expect(err).toBeFalsy();
        done();
      })
    })
  })

  describe('test invalid DNS server before adding to resolvers', function() {
  
    // List of invalid servers
    var server = '4.4.8.8';
    
    it('returns an error if the DNS server is invalid', function(done) {
      subquest.isValidDnsServer(server, function(err) {
        expect(err).toBeTruthy();
        done();
      })
    })
  })
})
