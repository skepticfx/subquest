var should = require('should')
var subquest = require('../')

describe('basic tests on google.com', function(){

  it('try a few sub-domains', function(done){
    subquest.find({domain: 'google.com', resolver: '8.8.8.8'})
  })

})
