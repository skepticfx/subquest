var	dns = require('native-dns');
var	util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');

// Function for Generic Brute Forcing
function find(obj){

	var dictionary = {};
	dictionary.top_50 = "dictionary/top-50.txt";
	dictionary.top_100 = "dictionary/top-100.txt";
	dictionary.top_150 = "dictionary/top-150.txt";
	dictionary.top_200 = "dictionary/top-200.txt";
	dictionary.all = "dictionary/all.txt";
	dictionary.resolver = "dictionary/resolvers.txt";

	var rateLimit = 5;
	if(typeof obj.rateLimit != "undefined")
		rateLimit = obj.rateLimit;	
	var dictionary_path = dictionary.top_100;
	var dictionary_arr = fs.readFileSync(path.join(__dirname, dictionary_path)).toString().split("\r\n");
	var domain = 'google.com';
	if(typeof obj.domain != "undefined")
		domain = obj.domain;

	async.eachLimit(dictionary_arr, rateLimit, bruteSubDomain, function(err){
		// if any of the saves produced an error, err would equal that error
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
			server: { address: '10.140.50.5', port: 53, type: 'udp' },
			timeout: 4000
		});

		req.on('timeout', function () {
			console.log('Timeout in making request');
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
exports.find = find;
