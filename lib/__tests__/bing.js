var subquest = require('../index')

describe('Usig bing domain dork queries', function() {

  describe('get the array of subdomains', function() {
    jest.setTimeout(10000)

    // Test bing search against google.com
    it('google.com', (done) => {
      subquest.getSubDomains({
        host: 'google.com',
        bingSearch: true
      }, (err, result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toMatch(/.google.com/)
        done();
      })
    })
  })
})
