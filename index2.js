var	dns = require('native-dns');
var	util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var debug = require('debug');
var events = require('events');


var validResolvers = [];
var dictionary = fs.readdirSync('./dictionary');
var resolvers = fs.readFileSync('./resolvers.txt').toString().trim().split('\n');

// Check whether a dns server is valid.
exports.isValidDnsServer = function(dnsServer, cb){
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
    cb(false);
  });

  // rcode = 0 , NoError
  // rcode = 3 , NXDomain
  req.on('message', function (err, answer) {
    if(answer.header.rcode == 0)
      cb(true);
    else
      cb(false);
  });

  req.send();
return;
}


/* Get the best resolver in the following order,
1. User supplied.
2. From our list.

This is used while specifying Custom DNS Server.
*/

exports.getResolver = function(dnsServer, result_cb){
  var dnsServers = [];
  // Handle the first arg as callback if no server is specified.
  if(typeof dnsServer !== 'function')
    dnsServers.push(dnsServer);
  else
    result_cb = dnsServer;

  dnsServers = dnsServers.concat(resolvers);

  async.eachSeries(dnsServers, function(server, cb){
    exports.isValidDnsServer(server, function(result){
      if(result === true){
        result_cb(server);
      } else {
        cb();
      }
    })
  })

}


/*
Steps:
1. Get the best resolver by checking with isValidDnsServer
2.


*/
