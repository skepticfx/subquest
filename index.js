'use strict'

const dns = require('dns')
const	util = require('util');
const async = require('async');
const fs = require('fs');
const path = require('path')
const os = require("os");

// Send DNS requests for current subdomain
const probeDNS = (subdomain, tld, cb) => {

	// Build the domain name
	const domain = `${subdomain}.${tld}`;

	// Run the resolve request
	dns.resolve(domain, 'A', err => {
		cb(err, domain);
	});
}

/**
 * Return the default DNS servers
 * @return {array} An array of DNS used by the module
 */
exports.getDefaultResolvers = function() {
	return fs.readFileSync(
		path.join(__dirname, 'resolvers.txt')
	).toString().trim().split(os.EOL)
}

// Check whether a dns server is valid.
exports.isValidDnsServer = function(dnsServer, timeout, cb) {
	// Ensure arguments are good
	if( typeof timeout === 'function' ) {
		cb = timeout
		timeout = 4000
	}

	// Set custom callback handler
	let called = false
	let dnsCallback = (err) => {
		clearTimeout(timeoutPromise);
		if(called) { return }
		called = true
		cb(err)
	};

	// Force to use this dns server
	dns.setServers([dnsServer]);

	// Set a custom timeout for DNS request
	let timeoutPromise = setTimeout(_ => {
		dnsCallback(new Error('Request timeout exceeded!'))
	}, timeout);

	// Try to resolve google.com
	dns.resolve4('www.google.com', dnsCallback);
}

/**
 * Get the best resolver in the following order:
 * 1. User supplied.
 * 2. From our list.
 * @param  {string} server The DNS server address as string
 * @param  {function} callback The callback to run once has done
 */
exports.getResolvers = function(server, callback){
	// Results array
	let dnsServers = exports.getDefaultResolvers();

	// Run callback if first variable is empty or undefined
	if (!server) {
		callback(dnsServers);
		return;
	}

	// Handle the first arg as callback if no server is specified.
	if (typeof server !== 'function') {

		// Validate custom DNS server than add to resolvers list
		exports.isValidDnsServer(server, 4000, (err) => {
			if(err === null) {
				dnsServers.unshift(server)
			}
			callback(dnsServers)
		});

	} else{
		callback = server;
		callback(dnsServers)
	}

}

/**
 * Get the dictionary files names
 * @return {array} Array of file names
 */
exports.getDictionaryNames = function(){
	return fs.readdirSync(path.join(__dirname, 'dictionary'));
}

// Send requests to a DNS resolver and find valid sub-domains
exports.getSubDomains = function(options, callback = () => {}) {
	// Default subdomain scan options
	let defaults = {
		dictionary: 'top_50'
	};

	// Clean undefined options
	Object.keys(options).forEach(key => options[key] === undefined && delete options[key]);

	// Extend default options with user defined ones
	options = Object.assign({}, defaults, options);

	// Exit if no host option
	if(!options.host)  {
		callback(new Error('The host property is missing.'))
		return;
	};

	// Optionally run a bing search
	if(options.bingSearch === true){
		var bingSearch = require('./lib/bingSearch.js');
		return bingSearch.find(options.host, callback)
	}

  // Get the resolvers list
	exports.getResolvers(options.dnsServer, (servers) => {

		// Set new servers list for the requests
		dns.setServers(servers);

    // Init dictionary array
    var dictionary;

    try {

      // Get dictionary lines
      dictionary = fs.readFileSync(
        path.join(__dirname, `dictionary/${options.dictionary}.txt`)
      );

    } catch (e) {
      callback(new Error(`The dictionary ${options.dictionary} was not found, make sure it exists in the dictionary folder.`));
      return;
    }

    // Get dictionary content and split lines in array rows
    dictionary.toString().trim().split(os.EOL);

		// Probe each subdomain
		async.mapSeries(dictionary, (subdomain, cb) => {
			probeDNS(subdomain, options.host, (err, res) => {
				cb(null, err ? null : res)
			})
		}, (err, results) => {
			// Filter from any empty result
			results = results.filter(v => v)
			callback(null, results);
		})

	})
}
