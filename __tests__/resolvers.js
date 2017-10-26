var subquest = require('../index.js')

describe('DNS Servers', function() {

  // Override default jest timeout
  beforeAll(function() {
    jest.setTimeout(5000)
  })
  
  describe('adds a user defined DNS server to the stack', function() {
    it('returns user defined DNS server as first', function(done) {
      // Custom DNS server
      let customDNS = '91.239.100.100'
  
      // Get resolvers list by adding valid provided server
      subquest.getResolvers(customDNS, function(result) {
        expect(result[0]).toBe(customDNS)
        done()
      })
    })
  })
})
