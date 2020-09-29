// grab included libraries
const {
  bitcoin,
  bech32,
  bip32,
  bip39,
  bip68,
  Buffer,
  bs58check,
  esploraApi: esplora
} = bitcoinjs
console.log('libraries used:', bitcoinjs)

// other useful shortcuts
const API_PATH = 'https://blockstream.info/testnet/api/'
// const API_PATH = 'https://blockstream.info/api/'
const op = bitcoin.opcodes
const encode = bitcoin.script.number.encode
const network = bitcoin.networks.testnet // or .bitcoin
const sighash_all = bitcoin.Transaction.SIGHASH_ALL

/* -------------------------------------------------------------------------- */
/*                              create page items                             */
/* -------------------------------------------------------------------------- */

const lblPM = document.createElement('div')
lblPM.innerHTML = 'Payment method (wallet):'
const taPM = document.createElement('textarea')
document.body.appendChild(lblPM)
document.body.appendChild(taPM)

const lblSI = document.createElement('div')
lblSI.innerHTML = 'Spending instructions (requested):'
const taSI = document.createElement('textarea')
document.body.appendChild(lblSI)
document.body.appendChild(taSI)

const lblOutput = document.createElement('div')
lblSI.innerHTML = 'tx hex:'
const taOut = document.createElement('textarea')
document.body.appendChild(lblOutput)
document.body.appendChild(taOut)

/* -------------------------------------------------------------------------- */
/*                            spending instructions                           */
/* -------------------------------------------------------------------------- */

const request = {
  // describe transaction, optional, default empty string
  info: 'test request',
  // tx version, optional, default 2
  version: undefined,
  // transaction nLockTime to use, default 0
  nLockTime: undefined,
  outputs: [
    {
      // integer, vout or output index (0+) that must be used for this output, optional
      vout: 0,
      // string, description of output for user, optional, empty string is default
      info: "Bob's address",
      // boolean, if output is optional, optional, default is false
      optional: undefined,
      // boolean, if optional should it be set by default, optional, default is true
      defaultOption: undefined,
      // string enum, standard type of output that determines output's visible SCRIPTPUBKEY, optional, {'P' (payment) | 'RETURN' (OP_RETURN) | ...}, 'P' is default
      type: undefined,
      // string, target address, required if type is not 'RETURN'
      address: 'tb1ql4ttnp2ay93qyqplgev343cwwqyqvdxyfdzk44',
      // integer, fixed value (sats) to use, optional
      value: 1000,
      // integer, max value (sats) user should send, optional
      maxValue: undefined,
      // integer, min Value (sats) user should send, optional
      minValue: undefined,
      // hex to embed in OP_RETURN type tx if used, optional
      embedHex: undefined,
      // boolean, note if simple address that only requires signing, optional, default is true
      justSign: true,
      // string, ASM of redeem script necessary to spend it later, optional
      redeemScript: undefined,
      // string, ASM of witness script necessary to spend it later, optional
      witnessScript: undefined,
      // hex string, inputs for redeem script if known necessary to spend it later, optional
      redeemScriptInputs: undefined,
      // hex string, inputs for witness script if known necessary to spend it later, optional
      witnessScriptInputs: undefined,
      // hex string, pubkeys to use to sign for redeem script inputs, optional
      redeemPubkeyForSigInputs: undefined,
      // hex string, pubkeys to use to sign for witness script inputs, optional
      witnessPubkeyForSigInputs: undefined,
      // string array, describing each input necessary for redeem script, optional
      infoRedeemScriptInputs: undefined,
      // string array, describing each input necessary for witness script, optional
      infoWitnessScriptInputs: undefined
    }
  ],
  inputs: [
    {
      // integer, vin or input index (0+) that must be used for this input, optional
      vin: 0,
      // string, description of input for user, optional, empty string is default
      info: "Alice's address",
      // boolean, if input is optional, optional, default is false
      optional: undefined,
      // boolean, if input should be set by default, optional, default is true
      defaultOption: undefined,
      // string, txid of utxo to use for input, optional
      txid: undefined,
      // integer, vout of utxo to use for input, optional
      vout: undefined,
      // string, address of utxo to use for input, optional
      address: 'tb1qzx9calarm0qc6vs6nc4kxqv4xk49rpf6842jsl',
      // integer, nSequence to use, optional, default is 0xffffffff which is 4294967295
      sequence: undefined,
      // string hex of utxo used for input, optional
      rawtx: undefined,
      // boolean, note if simple address that only requires signing, optional in request, default is true
      justSign: true,
      // array of integers, sighash to use, optional, default SIGHASH_ALL or 0x01
      sighashTypes: undefined,
      // string, ASM of redeem script necessary to spend it, optional
      redeemScript: undefined,
      // string, ASM of witness script necessary to spend it, optional
      witnessScript: undefined,
      // hex string, inputs for redeem script if known necessary to spend it, optional
      redeemScriptInputs: undefined,
      // hex string, inputs for witness script if known necessary to spend it, optional
      witnessScriptInputs: undefined,
      // hex string, pubkeys to use to sign for redeem script inputs, optional
      redeemPubkeyForSigInputs: undefined,
      // hex string, pubkeys to use to sign for witness script inputs, optional
      witnessPubkeyForSigInputs: undefined,
      // string array, describing each input necessary for redeem script, optional, default is empty array
      infoRedeemScriptInputs: undefined,
      // string array, describing each input necessary for witness script, optional, default is empty array
      infoWitnessScriptInputs: undefined
    }
  ]
}
taSI.value = JSON.stringify(request, null, 2)

/* -------------------------------------------------------------------------- */
/*                                  build tx                                  */
/* -------------------------------------------------------------------------- */

const psbt = new bitcoin.Psbt()

// export unfinished const psbtBaseText = psbt.toBase64()
// import unfinished const psbt1 = bitcoin.Psbt.fromBase64(psbtBaseText)
// combine with psbt.combine(psbt1, psbt2)

// test API
;(async () => {
  // const res = await esplora.getHeightAPI(API_PATH)

  /* ------------------------ get all utxo for address ------------------------ */

  // check outputs for this address
  await new Promise(r => setTimeout(r, 500))
  const addressToCheck = 'tb1qzx9calarm0qc6vs6nc4kxqv4xk49rpf6842jsl'
  const utxos = await esplora.getUTXOListAPI(API_PATH, addressToCheck)

  /* ---------------------- get the raw tx for each txid ---------------------- */

  const rawtxs = {}
  for (let i = 0; i < utxos.length; i++) {
    const thisTxid = utxos[i].txid
    rawtxs[thisTxid] = await esplora.getRawTxAPI(API_PATH, thisTxid)
    await new Promise(r => setTimeout(r, 500))
  }

  /* ----------------------------- complete wallet ---------------------------- */

  const wallet = {
    wifs: [], // keys for fixed addresses
    mnemonics: [], // mnemonics for HD wallets
    utxos: [], // known utxos when possible to track ownership
    txs: [] // tx history when possible to track past activity (useful for HD)
  }
  for (let i = 0; i < utxos.length; i++) {
    // wallet is just tracking utxos w/ various parameters (never stored cleartext)
    wallet.utxos.push({
      // boolean, is this output meant to be private, optional, default false
      private: false,
      // { txid, value, vout, status: { block_hash, block_height, block_time, confirmed }}
      ...utxos[i],
      //  address of the utxo, necessary if request uses input address (e.g. identity)
      address: addressToCheck,
      // raw tx hex, eventually needed to spend
      rawTxHex: rawtxs[utxos[i].txid] // raw tx hex needed for psbt
    })
  }

  const wif = window.prompt('enter WIF to use for wallet')
  wallet.wifs.push(String(wif))

  console.log('exported wallet:', JSON.stringify(wallet, null, 2))
  taPM.value = JSON.stringify(wallet, null, 2)
})()

/* -------------------------------------------------------------------------- */
/*                        if need a new address to use                        */
/* -------------------------------------------------------------------------- */

const generateNewAddress = () => {
  const pathRandom = "m/44'/0'/0'/0/0"
  const mnemonicRandom = bip39.generateMnemonic()
  const seedRandom = bip39.mnemonicToSeedSync(mnemonicRandom)
  const rootRandom = bip32.fromSeed(seedRandom)
  const nodeRandom = rootRandom.derivePath(pathRandom)
  const addressRandom = bitcoin.payments.p2wpkh({
    pubkey: nodeRandom.publicKey,
    network
  }).address
  const wifRandom = nodeRandom.toWIF()

  console.log(`
    If need a new address to use
    address: ${addressRandom}
    mnemonic: ${mnemonicRandom}
    path: ${pathRandom}
    WIF: ${wifRandom}
  `)
}
// generateNewAddress();
