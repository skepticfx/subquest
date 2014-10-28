var should = require('should')
var subquest = require('../')


var options = {
  host: 'google.com'
}

describe('Bruteforce Subdomains', function(){

  describe('get the array of subdomains', function(){
    this.timeout(20000)

    it('using default dictionary', function(done){
      subquest.getSubDomains(options)
        .on('end', function(result){
          result.should.be.an.Array
          result.should.containEql('blog.google.com')
          done();
        })
    })

  })

})
