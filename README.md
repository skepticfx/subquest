# subquest
[![Build Status](https://travis-ci.org/skepticfx/subquest.svg?branch=master)](https://travis-ci.org/skepticfx/subquest)
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
Than you can __require__ it in your script and use various methods:

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

## Want to add a new entry to Subquest's dictionary?

Add your list of subdomain names to the `./dictionary/all.txt` file and send a pull request.

## Credits
* Domain dictionary from Sub-Brute by Rook, https://github.com/TheRook/subbrute
