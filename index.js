var	dns = require('native-dns');
var	util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var debug = require('debug');
var events = require('events');


var validResolvers = [];
var dictionary = {};
dictionary.top_50 = "dictionary/top_50.txt";
dictionary.top_100 = "dictionary/top_100.txt";
dictionary.top_150 = "dictionary/top_150.txt";
dictionary.top_200 = "dictionary/top_200.txt";
dictionary.all = "dictionary/all.txt";
dictionary.resolver = "dictionary/resolvers.txt";


// This can all be in parallel, since its all different servers.
// The callback is fired with the first found valid DNS Resolver.
// ARGS-> all, callback - all = Populate all the valid DNS Servers.
exports.getResolvers = function(all, foundDnsServer, dnsServer){
	if(typeof dnsServer != "undefined"){
		queryResolvers(dnsServer);
		return;
	}
	var FIRST_DNS = 0;
	if(all == 1)
		console.log('Hold on a second ! We are populating the list of valid DNS Resolvers.');
	var dictionary_path = dictionary.resolver;
	var dictionary_arr = fs.readFileSync(path.join(__dirname, dictionary_path)).toString().split('\n');
	async.eachLimit(dictionary_arr, 1, queryResolvers, function(err){
		if(validResolvers.length == 0){
			console.log('Could not find any active DNS resolver. Quitting now.');
			process.exit(1);
		} else {
			if(all == 1)
				console.log('Good ! We have populated the active DNS resolvers.');
			return;
		}
	});

	function queryResolvers(item, callback){
		var domain = 'www.google.com';
		var question = dns.Question({
			name: domain,
			type: 'A',
		});

		var start = Date.now();
		var req = dns.Request({
			question: question,
			server: { address: item, port: 53, type: 'udp' },
			timeout: 4000
		});

		req.on('timeout', function () {
			console.log('Timeout in making request');
		});

		// rcode = 0 , NoError
		// rcode = 3 , NXDomain
		req.on('message', function (err, answer) {
			if(answer.header.rcode == 0){
				validResolvers.push(item);
				if(all == 0){
					foundDnsServer(item);
					callback(true);
				}
			}
		});

		req.on('end', function () {
			var delta = (Date.now()) - start;
			//console.log('Finished processing request: ' + delta.toString() + 'ms');
			if(all == 0)
				callback(true);
			else
				callback(null);
		});

		req.send();
	}

}

// Function to check a given DNS Resolver
function checkDnsServer(dnsServer, callback){
	var isValid = 0;
	var question = dns.Question({
		name: 'www.google.com',
		type: 'A',
	});

	var start = Date.now();
	var req = dns.Request({
		question: question,
		server: { address: dnsServer, port: 53, type: 'udp' },
		timeout: 4000
	});

	req.on('timeout', function () {
		console.log('Timeout while querying the DNS Server, ' + dnsServer);
		isValid = 0;
	});

	// rcode = 0 , NoError
	// rcode = 3 , NXDomain
	req.on('message', function (err, answer) {
		if(answer.header.rcode == 0)
			isValid = 1;
	});

	req.on('end', function () {
		var delta = (Date.now()) - start;
		//console.log('Finished processing request: ' + delta.toString() + 'ms');
		callback(null, isValid);
	});

	req.send();
}
// Function for Generic Brute Forcing
function find(obj){
	var rateLimit = 5;
	if(typeof obj.rateLimit != "undefined")
		rateLimit = obj.rateLimit;
	var dictionary_path = dictionary.top_100;
	if(typeof obj.dictionary != "undefined")
		dictionary_path = dictionary[obj.dictionary];
	var dictionary_arr = fs.readFileSync(path.join(__dirname, dictionary_path)).toString().split('\n');
	var domain = 'google.com';
	if(typeof obj.domain != "undefined")
		domain = obj.domain;
	if(typeof obj.resolver != "undefined"){
		checkDnsServer(obj.resolver, function(err, x){
			if(x == 1){
				doFind(obj.resolver);
			} else {
				console.log('The DNS Server, ' + obj.resolver + ' doesn\'t seems to respond.');
				return;
			}
		});
	}else{
		getResolvers(0, doFind);
	}

	function doFind(dnsServer){
		async.eachLimit(dictionary_arr, rateLimit, bruteSubDomain, function(err){
			console.log('Finished bruteforcing, '+ domain);
			return;
		});

		function bruteSubDomain(item, callback){
			var Sdomain = item + '.' + domain;
			var question = dns.Question({
				name: Sdomain,
				type: 'A',
			});

			var start = Date.now();

			var req = dns.Request({
				question: question,
				server: { address: dnsServer, port: 53, type: 'udp' },
				timeout: 4000
			});

			req.on('timeout', function () {
				//console.log('Timeout in making request');
			});

			// rcode = 0 , NoError
			// rcode = 3 , NXDomain
			req.on('message', function (err, answer) {
				if(answer.header.rcode == 0)
					console.log(Sdomain);
			});

			req.on('end', function () {
				var delta = (Date.now()) - start;
				//console.log('Finished processing request: ' + delta.toString() + 'ms');
				callback();
			});

			req.send();

		}
	}
}

exports.find = find;
//find({domain: 'facebook.com', rateLimit: '10', dictionary: 'all'});


/*
find()
domain
rateLimit
dictionary
resolver



*/
