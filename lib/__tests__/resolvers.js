var subquest = require('../index')

describe('Get Resolvers:', function() {

  // Override default jest timeout
  beforeAll(function() {
    jest.setTimeout(10000)
  })

  describe('adds a user defined DNS server to the stack', function() {
    it('returns user defined DNS server as first', function(done) {
      // Custom DNS server
      let customDNS = '8.8.8.8'

      // Get resolvers list by adding valid provided server
      subquest.getResolvers(customDNS, function(result) {
        expect(result[0]).toBe(customDNS)
        done()
      })
    })
  })
})
