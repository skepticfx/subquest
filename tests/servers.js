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
        subquest.isValidDnsServer(dnsServer,function(result){
          result.should.be.true;
          done();
        })
      })
    })
  })


  describe('check list of all in-valid DNS servers', function(){
    this.timeout(5000)
    var invalidServers = [
      '4.4.8.8',
      '8.6.56.26',
      '12.12.3.1'
      ];

    invalidServers.forEach(function(dnsServer){
      it(dnsServer, function(done){
        subquest.isValidDnsServer(dnsServer,function(result){
          result.should.be.false;
          done();
        })
      })
    })
  })

  describe('get the best DNS server availble', function(){
    this.timeout(20000)

    it('some random non-dns server: 1.1.14.2', function(done){
      subquest.getResolver('1.1.14.2', function(result){
        result.should.be.exactly('8.8.8.8')
        done()
      })
    })

    it('with a valid server: 8.26.56.26', function(done){
      subquest.getResolver('8.26.56.26', function(result){
        result.should.be.exactly('8.26.56.26')
        done()
      })
    })

    it('without supplying any DNS server', function(done){
      subquest.getResolver(function(result){
        result.should.be.exactly('8.8.8.8')
        done()
      })
    })

  })


})
