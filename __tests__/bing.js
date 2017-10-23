var subquest = require('../')

describe('Usig bing domain dork queries', function() {

  describe('get the array of subdomains', function() {

    it('yahoo.com', (done) => {
      subquest.getSubDomains({
        host: 'yahoo.com',
        bingSearch: true
      }).on('end', function(result) {
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toMatch(/.yahoo.com/)
        done();
      })
    })

    it('google.com', (done) => {
      subquest.getSubDomains({
        host: 'google.com',
        bingSearch: true
      }).on('end', function(result) {
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toMatch(/.google.com/)
        done();
      })
    })

  })

})
