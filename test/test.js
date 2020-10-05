/**
 * Testing wallet design & prototyping necessary steps
 *
 * Action flow has 4 major steps:
 * 1. Application provides "REQUEST INSTRUCTIONS" (RI)
 * 2. Wallet provides "PAYMENT METHOD" (PM)
 * 3. Transaction is built using constraints of (1) filled in by (2) and user input
 * 4. Before user signs the final transaction, user presented with full layout.
 */

/* -------------------------------------------------------------------------- */
/*                              set up libraries                              */
/* -------------------------------------------------------------------------- */

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
console.log('Libraries imported:', bitcoinjs)

// other useful shortcuts
const API_PATH = 'https://blockstream.info/testnet/api/' // testnet
// const API_PATH = 'https://blockstream.info/api/' // mainnet
const op = bitcoin.opcodes
const encode = bitcoin.script.number.encode
const network = bitcoin.networks.testnet // or .bitcoin
const sighash_all = bitcoin.Transaction.SIGHASH_ALL

/* -------------------------------------------------------------------------- */
/*                      keep track of transaction layout                      */
/* -------------------------------------------------------------------------- */

const defaultInput = {
  utxoTxid: '',
  utxoVout: '',
  utxoTxHex: '',
  nSequence: '0xffffffff',
  redeemScriptHex: '',
  witnessScriptHex: '',
  value: ''
}

const defaultOutput = {
  address: '',
  value: '',
  dataHex: ''
}

const defaultTransactionBuilder = {
  version: 2,
  locktime: 0,
  inputs: [],
  outputs: []
}

// create initial transaction
let activeTransactionBuilder = JSON.parse(
  JSON.stringify(defaultTransactionBuilder)
)
activeTransactionBuilder.inputs.push({ ...defaultInput })
activeTransactionBuilder.outputs.push({ ...defaultOutput })
// activeTransactionBuilder.outputs.push({ ...defaultOutput })

/* -------------------------------------------------------------------------- */
/*                              create page items                             */
/* -------------------------------------------------------------------------- */

const createElements = async transactionBuilder => {
  // clear all html
  resetRender()

  // set up basics
  addSection({ label: 'Detailed transaction editor' })
  addField({
    label: 'Transaction version',
    initial: transactionBuilder.version
  })
  addField({ label: 'LockTime', initial: transactionBuilder.locktime })

  addSection({ label: 'All inputs' })
  transactionBuilder.inputs.forEach((input, vin) => {
    addInput({ input, vin })
  })

  addSection({ label: 'All outputs' })
  transactionBuilder.outputs.forEach((output, vout) => {
    addOutput({ output, vout })
  })
}

createElements(activeTransactionBuilder)

// const lblPM = document.createElement('div')
// lblPM.innerHTML = 'Payment method (wallet):'
// const taPM = document.createElement('textarea')
// document.body.appendChild(lblPM)
// document.body.appendChild(taPM)

// const lblSI = document.createElement('div')
// lblSI.innerHTML = 'Spending instructions (requested):'
// const taSI = document.createElement('textarea')
// document.body.appendChild(lblSI)
// document.body.appendChild(taSI)

// const lblOutput = document.createElement('div')
// lblSI.innerHTML = 'tx hex:'
// const taOut = document.createElement('textarea')
// document.body.appendChild(lblOutput)
// document.body.appendChild(taOut)

/* -------------------------------------------------------------------------- */
/*                            spending instructions                           */
/* -------------------------------------------------------------------------- */

// taSI.value = JSON.stringify(exampleRequestInstructions, null, 2)

/* -------------------------------------------------------------------------- */
/*                               Payment method                               */
/* -------------------------------------------------------------------------- */

// simplest wallet is some of these (never stored in clear text)
// * array of private keys (e.g. WIF's)
// * HD wallet mnemonic + path
// * xpriv + path
// ideally also marked outputs if private (avoid recombining)

const wallet = {
  // keys for fixed addresses, { wif: string, private: boolean, info: string }
  wifs: [],
  // mnemonics for HD wallets, { words: string, path: string, private: boolean, info: string }
  mnemonics: [],
  // xpriv for HD wallets, { xpriv: string, path: string, private: boolean, info: string }
  xpriv: [],

  // known addresses derived from above or added manually
  addresses: {},
  // known public keys derived from above or added manually
  pubkeys: {},
  // known xpubs derived from above or added manually to watch-only
  xpubs: {},

  // possible after API
  //
  // known utxos when possible to track ownership
  utxos: [],
  txs: [], // tx history when possible to track past activity (useful for HD)

  // custom fields for non-standard usecases like random stealth address paths
  custom: {}
}

// ;(async () => {})()

//   /* ------------------------ get all utxo for address ------------------------ */

//   const utxos = []
//   for (let i = 0; i < wallet.addresses.length; i++) {
//     const res = await esplora.getUTXOListAPI(API_PATH, wallet.addresses[i])
//     res.forEach(utxo => {
//       const utxoWithAddress = {
//         ...utxo,
//         address: wallet.addresses[i]
//       }
//       utxos.push(utxoWithAddress)
//     })
//   }

/* ---------------------- get the raw tx for each txid ---------------------- */

// const rawtxs = {}
// for (let i = 0; i < utxos.length; i++) {
//   const thisTxid = utxos[i].txid
//   rawtxs[thisTxid] = await esplora.getRawTxAPI(API_PATH, thisTxid)
//   await new Promise(r => setTimeout(r, 500))
// }

/* ----------------------------- complete wallet ---------------------------- */

// for (let i = 0; i < utxos.length; i++) {
//   // wallet is just tracking utxos w/ various parameters (never stored cleartext)
//   wallet.utxos.push({
//     // boolean, is this output meant to be private, optional, default false
//     private: false,
//     // { address, txid, value, vout, status: { block_hash, block_height, block_time, confirmed }}
//     ...utxos[i],
//     // raw tx hex, eventually needed to spend
//     rawTxHex: rawtxs[utxos[i].txid] // raw tx hex needed for psbt
//   })
// }

// const wif = window.prompt('enter WIF to use for wallet')
// wallet.wifs.push(String(wif))

// console.log('exported wallet:', JSON.stringify(wallet, null, 2))
// taPM.value = JSON.stringify(wallet, null, 2)

/* -------------------------------------------------------------------------- */
/*                        if need a new address to use                        */
/* -------------------------------------------------------------------------- */

// const generateNewAddress = () => {
//   const pathRandom = "m/44'/0'/0'/0/0"
//   const mnemonicRandom = bip39.generateMnemonic()
//   const seedRandom = bip39.mnemonicToSeedSync(mnemonicRandom)
//   const rootRandom = bip32.fromSeed(seedRandom)
//   const nodeRandom = rootRandom.derivePath(pathRandom)
//   const addressRandom = bitcoin.payments.p2wpkh({
//     pubkey: nodeRandom.publicKey,
//     network
//   }).address
//   const wifRandom = nodeRandom.toWIF()

//   console.log(`
//     If need a new address to use
//     address: ${addressRandom}
//     mnemonic: ${mnemonicRandom}
//     path: ${pathRandom}
//     WIF: ${wifRandom}
//   `)
// }
// generateNewAddress();

// const psbt = new bitcoin.Psbt()
// export unfinished const psbtBaseText = psbt.toBase64()
// import unfinished const psbt1 = bitcoin.Psbt.fromBase64(psbtBaseText)
// combine with psbt.combine(psbt1, psbt2)

// check outputs for this address
// await new Promise(r => setTimeout(r, 500))
