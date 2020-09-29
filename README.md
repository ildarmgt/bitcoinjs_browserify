# Instructions

based on https://github.com/bitcoinjs/bitcoinjs-lib/issues/965 discussion

first make browserify and uglify available globally
`npm i -g browserify uglify-es`

for each library you want have to run the following first
`npm i bitcoinjs-lib bip32 bip39 bip68 bech32 bs58check axios`

add each library you want included as sub-object of main objet

```js
const bitcoinjs = {}
bitcoinjs.bitcoin = require('bitcoinjs-lib')
bitcoinjs.bech32 = require('bech32')
bitcoinjs.bip32 = require('bip32')
bitcoinjs.bip39 = require('bip39')
bitcoinjs.bip68 = require('bip68')
bitcoinjs.Buffer = require('buffer')
bitcoinjs.bs58check = require('bs58check')
bitcoinjs.esploraApi = require('./other/esplora_api.js') // also needs axios
module.exports = bitcoinjs
```

run `npm run make`

which runs these 2 commands:

create js file with
`browserify -r . --standalone bitcoinjs_lib > bitcoinjs.js`

create min file with
`uglifyjs -c --mangle reserved=['BigInteger','ECPair','Point'] bitcoinjs.js > bitcoinjs.min.js`


This makes bitcoinjs.js and bitcoinjs.min.js that can be used in browser directly with the other libraries available as internal properties.