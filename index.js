const bitcoinjs = {}
bitcoinjs.bitcoin = require('bitcoinjs-lib')
bitcoinjs.bech32 = require('bech32')
bitcoinjs.bip32 = require('bip32')
bitcoinjs.bip39 = require('bip39')
bitcoinjs.bip68 = require('bip68')
bitcoinjs.Buffer = require('buffer')
bitcoinjs.bs58check = require('bs58check')
bitcoinjs.esploraApi = require('./other/esplora_api.js')
module.exports = bitcoinjs