// top-100.js

// var subquest = require('subquest');
var subquest = require('../');

console.log('Here are the top sub-domains for google.com');
subquest.find({domain: 'google.com'});
