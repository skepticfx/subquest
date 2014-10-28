var should = require('should')
var subquest = require('../')


var options = {
  host: 'google.com'
}

describe('Bruteforce Subdomains using DNS requests', function(){

  describe('get the array of subdomains', function(){
    this.timeout(20000)

    it('google.com', function(done){
      subquest.getSubDomains(options)
        .on('end', function(result){
          result.should.be.an.Array
          result.should.containEql('blog.google.com')
          done();
        })
    })

  })

})


describe('Usig bing domain dork queries', function(){

  describe('get the array of subdomains', function(){
    this.timeout(20000)

    it('yahoo.com', function(done){
      subquest.getSubDomains({host: 'yahoo.com', bingSearch: true})
        .on('end', function(result){
          result.should.be.an.Array
          result.should.containEql('login.yahoo.com')
          done();
        })
    })

  it('google.com', function(done){
    subquest.getSubDomains({host: 'google.com', bingSearch: true})
      .on('end', function(result){
        result.should.be.an.Array
        result.should.containEql('accounts.google.com')
        done();
      })
  })

  })

})
