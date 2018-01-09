'use strict';

const dns = require('dns');
const async = require('async');
const fs = require('fs');
const path = require('path');
const EOL = /\r?\n/g;

const dictionariesPath = path.join(__dirname, '../dictionary');

// Send DNS requests for current subdomain
exports.probeDNS = (subdomain, tld, cb) => {
  // Build the domain name
  const domain = `${subdomain}.${tld}`;

  // Run the resolve request
  dns.resolve(domain, 'A', cb);
};

/**
 * Return the default DNS servers
 * @return {array} An array of DNS used by the module
 */
exports.getDefaultResolvers = function () {
  return fs.readFileSync(
    path.join(__dirname, 'resolvers.txt')
  ).toString().trim().split(EOL);
};

// Check whether a dns server is valid.
exports.isValidDnsServer = function (dnsServer, timeout, cb) {
  // Ensure arguments are good
  if (typeof timeout === 'function') {
    cb = timeout;
    timeout = 4000;
  }

  // Set custom callback handler
  let called = false;
  let timeoutPromise = null;
  let dnsCallback = err => {
    clearTimeout(timeoutPromise);
    if (called) {
      return;
    }
    called = true;
    cb(err);
  };

  // Force to use this dns server
  dns.setServers([dnsServer]);

  // Set a custom timeout for DNS request
  timeoutPromise = setTimeout(() => {
    dnsCallback(new Error('Request timeout exceeded!'));
  }, timeout);

  // Try to resolve google.com
  dns.resolve4('www.google.com', dnsCallback);
};

/**
 * Get the best resolver in the following order:
 * 1. User supplied.
 * 2. From our list.
 * @param  {string} server The DNS server address as string
 * @param  {function} callback The callback to run once has done
 */
exports.getResolvers = function (server, callback) {
  // Results array
  let dnsServers = exports.getDefaultResolvers();

  // Return default dns servers
  if (typeof server === 'undefined') {
    callback(dnsServers);

  // Return default dns servers
  } else if (typeof server === 'function') {
    callback = server;
    callback(dnsServers);

  // Validate custom DNS server than add to resolvers list
  } else {
    exports.isValidDnsServer(server, 4000, err => {
      if (err === null && dnsServers.indexOf(server) === -1) {
        dnsServers.unshift(server);
      }
      callback(dnsServers);
    });
  }
};

/**
 * Get the dictionary files names
 * @return {array} Array of file names
 */
exports.getDictionaryNames = function () {
  return fs.readdirSync(dictionariesPath);
};

// Send requests to a DNS resolver and find valid sub-domains
exports.getSubDomains = function (options, callback = () => {}) {
  // Default subdomain scan options
  let defaults = {
    dictionary: 'top_50'
  };

  // Clean undefined options
  Object.keys(options).forEach(key => options[key] === undefined && delete options[key]);

  // Extend default options with user defined ones
  options = Object.assign({}, defaults, options);

  // Exit if no host option
  if (!options.host) {
    callback(new Error('The host property is missing.'));
    return;
  }

  // Optionally run a bing search
  if (options.bingSearch === true) {
    var bingSearch = require('./bingSearch.js');
    return bingSearch.find(options.host, callback);
  }

  // Build dictionary file path and test for existence
  let dictionaryPath = path.join(dictionariesPath, `${options.dictionary}.txt`);
  if (!fs.existsSync(dictionaryPath)) {
    callback(new Error(`The dictionary file ${options.dictionary} does not exist.`));
    return;
  }

  async.waterfall([
    cb => {
      let wildcard = Math.floor(Math.random() * 1e14) + 1e15;
      exports.probeDNS(wildcard, options.host, err => {
        cb(null, err ? null : true);
      });
    },
    (wildcard, cb) => {
      // If wildcard is enabled return it and stop
      if (wildcard) {
        cb(null, ['*']);
        return;
      }

      // Get the resolvers list
      exports.getResolvers(options.dnsServer, servers => {
        // Set new servers list for the requests
        dns.setServers(servers);

        // Get dictionary content and split lines in array rows
        let dictionary = fs.readFileSync(dictionaryPath).toString().trim().split(EOL);

        // Probe each subdomain
        async.mapSeries(dictionary, (subdomain, next) => {
          let address = `${subdomain}.${options.host}`;
          exports.probeDNS(subdomain, options.host, err => {
            next(null, err ? null : address);
          });
        }, (err, results) => {
          cb(err, results.filter(v => v));
        });
      });
    }
  ], callback);
};
