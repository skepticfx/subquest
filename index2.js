var	dns = require('native-dns');
var	util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var debug = require('debug');
var events = require('events');


var validResolvers = [];


// Check whether a dns server is valid.
exports.isValidDnsServer = function(dnsServer){
  var EE = new events.EventEmitter();
  var question = dns.Question({
    name: 'www.google.com',
    type: 'A',
  });
  var req = dns.Request({
    question: question,
    server: { address: dnsServer, port: 53, type: 'udp' },
    timeout: 4000
  });

  req.on('timeout', function () {
    console.log('Timeout while querying the DNS Server, ' + dnsServer);
    EE.emit('invalid', 'Timeout while querying the DNS Server');
  });

  // rcode = 0 , NoError
  // rcode = 3 , NXDomain
  req.on('message', function (err, answer) {
    if(answer.header.rcode == 0)
      EE.emit('valid');
  });

  req.send();

return EE;
}
