var	dns = require('native-dns');
var	util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var events = require('events');
var path = require('path')
var os = require("os");

// Get the DNS servers addresses
var resolvers = fs.readFileSync(__dirname+'/resolvers.txt').toString().trim().split(os.EOL);

// Check whether a dns server is valid.
exports.isValidDnsServer = function(dnsServer, cb){
	var req = dns.Request({
		question: dns.Question({
			name: 'www.google.com',
			type: 'A',
		}),
		server: { address: dnsServer, port: 53, type: 'udp' },
		timeout: 4000
	});

	req.on('timeout', function () {
		cb(false);
	});

	// rcode = 0 , NoError
	// rcode = 3 , NXDomain
	req.on('message', function (err, answer) {
		if(answer.header.rcode == 0) {
			cb(true);
		} else{
			cb(false);
		}
	});

	// Send the DNS verification request
	req.send();

	return;
}

/**
 * Get the best resolver in the following order,
 * 1. User supplied.
 * 2. From our list.
 * This is used while specifying Custom DNS Server.
 * @param  {string} dnsServer The DNS server address as string
 * @param  {function} result_cb The callback to run once has done
 * @return {[type]}           [description]
 */
exports.getResolver = function(dnsServer, callback){
	// Init results array
	var dnsServers = [];

	// Handle the first arg as callback if no server is specified.
	if(typeof dnsServer !== 'function') {
		dnsServers.push(dnsServer);
	} else{
		callback = dnsServer;
	}

	// Concat the DNS servers arrays
	dnsServers = dnsServers.concat(resolvers);

	// For each server validate it and run the callback
	async.eachSeries(dnsServers, function(server, cb){
		exports.isValidDnsServer(server, function(result){
			if(result === true){
				callback(server);
			} else {
				cb();
			}
		})
	})

}

/**
 * Get the dictionary files names
 * @return {array} Array of file names
 */
exports.getDictionaryNames = function(){
	return fs.readdirSync(path.join(__dirname, 'dictionary'));
}

// Send requests to a DNS resolver and find valid sub-domains
exports.getSubDomains = function(opts){
	let defaults = {
		dictionary: 'top_50',
		dnsServer: '8.8.8.8'
	};

	var EE = new events.EventEmitter();
	opts = Object.assign({}, defaults, opts);

	if(!opts.host)  EE.emit('error', 'HOST_ERROR');

	// Optionally run a bing search
	if(opts.bingSearch === true){
		var bingSearch = require('./lib/bingSearch.js');
		return bingSearch.find(opts.host)
	}

	exports.getResolver(opts.dnsServer, function(dnsServer){

		EE.emit('dnsServer', dnsServer);

		var dictionary = fs.readFileSync(path.join(__dirname, `dictionary/${opts.dictionary}.txt`)).toString().trim().split(os.EOL);

		var subdomains = [];
		var total = dictionary.length;

		dictionary.forEach(function(subdomain) {

			probeDNS(subdomain, opts.host, dnsServer)
				.once('found', function(result) {
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

// Send DNS requests
function probeDNS(subdomain, tld, dnsServer){

	var EE = new events.EventEmitter();

	var domain = `${subdomain}.${tld}`;

	var req = dns.Request({
		question: dns.Question({
			name: domain,
			type: 'A',
		}),
		server: {address: dnsServer, port: 53, type: 'udp'},
		timeout: 5000
	});

	// rcode = 0 , NoError
	// rcode = 3 , NXDomain
	req.on('message', function (err, answer) {

		if(answer.header.rcode == 0){
			EE.emit('found', domain);
		}

	});

	// Emit the end event
	req.on('end', function () {
	  EE.emit('end');
	});

	req.send();

	return EE;
}
