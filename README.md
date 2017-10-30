# subquest

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Known Vulnerabilities][snyk-image]][snyk-url]

> Fast, Elegant subdomain scanner using nodejs

![logo](logo.png)

## Installation
To use __subquest__ in your node scripts you have to install it and add it to your project dependencies:
```
npm install --save subquest
```
Than you can __require__ it in your script and use it, following examples below.

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

## Looking for the cli version?
You can use __subquest__ as a command line tool by cloning the [official repository](https://github.com/b4dnewz/subquest-cli) or using npm:
```sh
$ npm install -g subquest-cli
```

## Want to add a new entry to Subquest's dictionary?

Add your list of subdomain names to the `./dictionary/all.txt` file and send a pull request.


## Contributing

1. Create an issue and describe your idea
2. Fork the project (https://github.com/skepticfx/subquest/fork)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Publish the branch (`git push origin my-new-feature`)
6. Create a new Pull Request

## Credits
* Domain dictionaries took from SecLists, https://github.com/danielmiessler/SecLists


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
