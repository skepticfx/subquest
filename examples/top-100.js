'use strict';

var subquest = require('../');
var domain = 'google.com'

console.log('Here are the top sub-domains for:', domain);

subquest.getSubDomains({
  host: domain
}).on('end', function(arr){
  console.log(arr);
});
