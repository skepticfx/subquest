'use strict'

// Search bing.com using the 'domain:' dork and retrieve possible sub-domains.
// Works only for the first page as of now.
// Need to search more pages (1-4 maybe)

const cheerio = require('cheerio');
const request = require('request');
const url = require('url');
const util = require('util');
const _ = require('lodash');

// Bing domains dork query
const bingDork = 'http://www.bing.com/search?count=50&q=domain:%s'

exports.find = function(domainName, callback = () => {}) {
  // Build bing query  
  let query = util.format(bingDork, domainName)
    
  // Perform a bing search request and parse response body
  // to extract subdomains from urls that match current domain
  request(query, function(err, res, body) {
        // If request produced an error exit
    if(err) {
      return callback(err)
    }

    // Load response body as HTML
    let $ = cheerio.load(body);
    
    // Init empty results array
    let list = [];

    // Loop through link results
    $('a').each(function(i, el) {

      // Ensure link has valid href attribute to parse
      let link = el.attribs.href;
      if (!link) {
        return;
      }

      // Get hostname from link
      let hostname = url.parse(link).hostname;
      
      // Ensure link is from current searched domain
      if (hostname && _.endsWith(hostname, `.${domainName}`) && list.indexOf(hostname) === -1) {
        list.push(hostname);
      }
    })

    // Filter array by unique values
    list = _.uniq(list);
    callback(null, list);
  })

}
