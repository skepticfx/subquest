var subquest = require('../index');

describe('Get Resolvers:', function () {
  jest.setTimeout(10000);

  describe('adds a user defined DNS server to the stack', function () {
    it('returns user defined DNS server as first', function (done) {
      // Custom DNS server
      let customDNS = '23.253.163.53';

      // Get resolvers list by adding valid provided server
      subquest.getResolvers(customDNS, function (result) {
        expect(result[0]).toBe(customDNS);
        done();
      });
    });

    it('returns the defaults resolvers if first argument is function', done => {
      subquest.getResolvers(function (result) {
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBeTruthy();
        done();
      });
    });
  });
});
