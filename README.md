# subquest
### Fast, Elegant subdomain scanner using nodejs

## Installation

`npm install -g subquest`

## Using it in your modules

`npm install subquest`


```js
var subquest = require('subquest');
console.log('Scanning the sub domains of ea.com with 4 requests at a time.');
subquest.find({domain: 'ea.com', rateLimit:'4'});
```

This scans ea.com for the list of all subdomains using the top-100 dictionary.

## Credits
* Domain dictionary from Sub-Brute by Rook, https://github.com/TheRook/subbrute
* node-dns, https://github.com/tjfontaine/node-dns
* async, https://github.com/caolan/async



