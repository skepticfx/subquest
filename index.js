var	dns = require('native-dns');
var	util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var debug = require('debug');
var events = require('events');


var validResolvers = [];
var resolvers = fs.readFileSync(__dirname+'/resolvers.txt').toString().trim().split('\n');

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

exports.getDictionaryNames = function(){
	return fs.readdirSync(__dirname+'/dictionary');
}


exports.getSubDomains = function(opts){
	var EE = new events.EventEmitter();
	if(!opts.host)  EE.emit('error', 'HOST_ERROR');
	opts.dictionary = opts.dictionary || 'top_100';
	opts.dnsServer = opts.dnsServer || '8.8.8.8';

	if(opts.bingSearch === true){
		var bingSearch = require('./lib/bingSearch.js');
		return bingSearch.find(opts.host)
	}

	exports.getResolver(opts.dnsServer, function(dnsServer){
		EE.emit('dnsServer', dnsServer);
		var dictionary = fs.readFileSync(__dirname+'/dictionary/'+ opts.dictionary+'.txt').toString().trim().split('\n');
		var subdomains = [];
		var total = dictionary.length;
		dictionary.forEach(function(subdomain){
			probeDNS(subdomain, opts.host, dnsServer)
				.once('found', function(result){
					EE.emit('subdomain', result);
					subdomains.push(result);
				})
				.once('end', function(){
					total--;
					if(total==0){
						EE.emit('end', subdomains);
					}
				})
		})
	})

return EE;
}

function probeDNS(subdomain, tld, dnsServer){
	var EE = new events.EventEmitter();
	var Sdomain = subdomain + '.' + tld;
	var question = dns.Question({
		name: Sdomain,
		type: 'A',
	});

	var start = Date.now();

	var req = dns.Request({
		question: question,
		server: {address: dnsServer, port: 53, type: 'udp'},
		timeout: 5000
	});

	req.on('timeout', function () {
		//console.log('Timeout in making request');
	});

	// rcode = 0 , NoError
	// rcode = 3 , NXDomain
	req.on('message', function (err, answer) {
		if(answer.header.rcode == 0)
			EE.emit('found', Sdomain);
	});

	req.on('end', function () {
		var delta = (Date.now()) - start;
		EE.emit('end');
		//console.log('Finished processing request: ' + delta.toString() + 'ms');
	});

	req.send();

return EE;
}
