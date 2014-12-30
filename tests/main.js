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
