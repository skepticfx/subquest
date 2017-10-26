# subquest

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Known Vulnerabilities][snyk-image]][snyk-url]

> Fast, Elegant subdomain scanner using nodejs

![logo](logo.png)

## Installation
If you want to use it as cli tool, you must install it globally first:
`sudo npm install -g subquest`

## Usage

```
  Usage: subquest [options] <domain to scan>
  Examples:
	subquest google.com
	subquest facebook.com -s 8.8.8.8 -r 20 -d top_50
	subquest twitter.com -s 8.8.8.8 -d all

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -b, --bingSearch         use Bing search to list all possible subdomains
    -s, --server [ip]        specify your custom DNS resolver
    -r, --rateLimit [limit]  set the Rate Limit [Default value is 10]
    -d, --dictionary [type]  set the dictionary for bruteforcing [top_100]
```

## Using it in your modules
If you want to use it as a node module you can install and add it to your project dependencies:

```
npm install subquest
```
Than you can __require__ it in your script and use it:

### After v1.5.0
After the version 1.5.0 the module doesn't use event emitters, just callbacks,
```js
const subquest = require('subquest')

subquest.getSubDomains({ 
  host: 'google.com' 
}, (err, results) => {
  
  if(err) {
    console.log('Error:', err);
    return;
  }
  
  console.log('Subdomains:', results);  
})
```

### Before v1.5.0
Before the version 1.5.0 the module makes use of event emitters to determine when it's done.
```js
var subquest = require('subquest');

subquest
  .getSubDomains({
    host: 'google.com', // required
    rateLimit:'4', // four requests at time
    dnsServer:'4.2.2.2', // custom DNS server
    dictionary: 'top_200' // dictionary file to use
    })
  .on('end', function(res){
    console.log(res); // array of subdomains.
  })
```

This scans google.com for the list of all subdomains using the top_200 dictionary.

## Methods
#### isValidDnsServer(server, [timeout], callback)
Test if a given address is valid DNS server

#### getResolvers([domain], callback) 
Get the list of all the resolvers (DNS Servers) used in the scan, both default and custom

#### getDictionaryNames() 
Get the list of the dictionary files used in the scan

#### getSubDomains(options, callback) 
Run the scan against the domain to enumerate all subdomains

## Want to add a new entry to Subquest's dictionary?

Add your list of subdomain names to the `./dictionary/all.txt` file and send a pull request.

## Credits
* Domain dictionary from Sub-Brute by Rook, https://github.com/TheRook/subbrute


[npm-image]: https://badge.fury.io/js/subquest.svg
[npm-url]: https://npmjs.org/package/subquest
[travis-image]: https://travis-ci.org/skepticfx/subquest.svg?branch=master
[travis-url]: https://travis-ci.org/skepticfx/subquest
[daviddm-image]: https://david-dm.org/skepticfx/subquest.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/skepticfx/subquest
[coveralls-image]: https://coveralls.io/repos/skepticfx/subquest/badge.svg
[coveralls-url]: https://coveralls.io/r/skepticfx/subquest
[snyk-image]: https://snyk.io/test/github/skepticfx/subquest/badge.svg
[snyk-url]: https://snyk.io/test/github/skepticfx/subquest
