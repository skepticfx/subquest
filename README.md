# subquest
### Fast, Elegant subdomain scanner using nodejs
![logo](https://raw.github.com/skepticfx/subquest/master/etc/logo.png)

## Status
[![Build Status](https://travis-ci.org/skepticfx/subquest.svg?branch=master)](https://travis-ci.org/skepticfx/subquest)

## Installation

`npm install -g subquest`

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
   -s, --server [ip]        Specify your custom DNS resolver
   -r, --ratelimit [limit]  Set the Rate Limit [Default value is 10]
   -d, --dictionary [type]  Set the dictionary for bruteforcing [top_100]
```

## Using it in your modules

`npm install subquest`


```js
var subquest = require('subquest');
console.log('Scanning the sub domains of ea.com with 4 requests at a time.');
subquest.find({domain: 'ea.com', rateLimit:'4', resolver:'4.2.2.2', dictionary: 'top_200'});
```

This scans ea.com for the list of all subdomains using the top-100 dictionary.

## Credits
* Domain dictionary from Sub-Brute by Rook, https://github.com/TheRook/subbrute
* node-dns, https://github.com/tjfontaine/node-dns
* async, https://github.com/caolan/async
* commander, https://github.com/visionmedia/commander.js
