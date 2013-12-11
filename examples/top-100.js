// top-100.js

var subquest = require('subquest');
console.log('Here are the top sud domains for google.com');
subquest.find({domain: 'google.com'});