var should = require('should')
var subquest = require('../index2')


describe('DNS Servers', function(){

  describe('check list of all valid DNS servers', function(){
    this.timeout(5000)
    var validServers = [
      '8.8.8.8',
      '8.26.56.26',
      '208.67.222.222'
      ];

    validServers.forEach(function(dnsServer){
      it(dnsServer, function(done){
        subquest
          .isValidDnsServer(dnsServer)
          .on('valid', done)
      })
    })
  })

})
