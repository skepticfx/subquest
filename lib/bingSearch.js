// Search bing.com using the 'domain:' dork and retrieve possible sub-domains.
// Works only for the first page as of now.
// Need to search more pages (1-4 maybe)

var cheerio = require('cheerio');
var request = require('request');
var url = require('url');
var _ = require('lodash');
var events = require('events');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


exports.find = function(domainName){
  var EE = new events.EventEmitter();
  // get a unique list of all hrefs which ends with the '.domain.com' form.
  request('http://www.bing.com/search?count=50&q=domain:'+ domainName, function(err, res, body){
    $ = cheerio.load(body);
    var list = [];
    $('a').each(function(i, el){
      var link = el.attribs.href;
      if(!link) return;
      var host = url.parse(link).host;
      if(host && host.endsWith('.'+domainName) && list.indexOf(host) === -1){
        list.push(host);
        EE.emit('subdomain', host);
      }
    })

    list = _.uniq(list);
    EE.emit('end', list)
  })

return EE;
}
