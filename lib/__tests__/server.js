var subquest = require('../index');

describe('Valid DNS Servers', function () {
  // Override default jest timeout
  beforeAll(function () {
    jest.setTimeout(10000);
  });

  describe('test DNS server before adding to resolvers', function () {
    it('returns success if the DNS server is valid', function (done) {
      // Google DNS servers
      var server = '8.8.8.8';

      subquest.isValidDnsServer(server, function (err) {
        expect(err).toBeFalsy();
        done();
      });
    });
  });
});
