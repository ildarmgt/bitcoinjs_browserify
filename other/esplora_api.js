// import axios from 'axios'
const axios = require('axios')

// Documentation
// https://github.com/Blockstream/esplora/blob/master/API.md
// https://github.com/Blockstream/esplora/blob/esplora_v2.00/API.md
// https://github.com/Blockstream/esplora/blob/master/API.md#post-tx

// public endpoints
// const API_PATH_TESTNET = 'https://blockstream.info/testnet/api/'
// const API_PATH_BITCOIN = 'https://blockstream.info/api/'

/* -------------------------------------------------------------------------- */
/*                             getFeeEstimatesAPI                             */
/* -------------------------------------------------------------------------- */

async function getFeeEstimatesAPI (path) {
  const API_PATH = path + 'fee-estimates'
  console.warn('Esplora API getFeeEstimates:', API_PATH)

  try {
    const res = await axios.get(API_PATH)
    console.warn('res.data:', res.data)
    return res.data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

/* -------------------------------------------------------------------------- */
/*                                getHeightAPI                                */
/* -------------------------------------------------------------------------- */

async function getHeightAPI (path) {
  const API_PATH = path + 'blocks/tip/height'
  console.warn('Esplora API getHeight:', API_PATH)

  try {
    const res = await axios.get(API_PATH)
    console.warn('res.data:', res.data)
    return res.data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

/* -------------------------------------------------------------------------- */
/*                                 getRawTxAPI                                */
/* -------------------------------------------------------------------------- */

async function getRawTxAPI (path, txid) {
  const API_PATH = path + 'tx/' + txid + '/hex'
  console.warn('Esplora API get raw tx hex:', API_PATH)

  try {
    const res = await axios.get(API_PATH)
    console.warn('res.data:', res.data)
    return res.data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

/* -------------------------------------------------------------------------- */
/*                               getUTXOListAPI                               */
/* -------------------------------------------------------------------------- */

async function getUTXOListAPI (path, address, includeUnconfirmed = true) {
  const API_PATH = path + 'address/' + address + '/utxo'
  console.warn('Esplora API get UTXO list:', API_PATH)

  try {
    const res = await axios.get(API_PATH)
    console.warn('res.data:', res.data)

    return includeUnconfirmed
      ? res.data
      : res.data.filter(utxo => utxo.status.confirmed)
  } catch (e) {
    console.warn(e)
    throw e
  }
}

/* -------------------------------------------------------------------------- */
/*                           getAddressTxHistoryAPI                           */
/* -------------------------------------------------------------------------- */

async function getAddressTxHistoryAPI (path, address, msDelay = 500) {
  // https://blockstream.info/testnet/api/address/tb1qprkzdaqt5jkxrhy57ngvra8k0rvq63ulksz8cx85qwke3myhjrtq9s6nj3/txs/chain
  // GET /address/:address/txs/chain[/:last_seen_txid]
  // Get confirmed transaction history for the specified address/scripthash, sorted with newest first.
  // Returns 25 transactions per page. More can be requested by specifying the last txid seen by the previous query.

  const MAX_TX = 25
  let lastTxid = ''
  const allTx = []

  const API_PATH = path + 'address/' + address + '/txs/chain/'

  try {
    do {
      const res = await axios.get(API_PATH + lastTxid)
      console.warn('Esplora API get address tx History:', API_PATH + lastTxid)
      console.warn(res.data)

      // add these tx to the list of tx
      allTx.push(...res.data)

      if (res.data.length >= MAX_TX) {
        lastTxid = res.data.slice(-1)[0].txid // last txid
        console.warn(
          'Multiple pages of tx detected, lastTxid received is',
          lastTxid
        )
        await new Promise(r => setTimeout(r, msDelay))
      } else {
        lastTxid = ''
      }

      // repeat until lastTxid is empty if not already
    } while (lastTxid !== '')

    return allTx
  } catch (e) {
    console.warn(e)
    throw e
  }
}

/* -------------------------------------------------------------------------- */
/*                                  txPushAPI                                 */
/* -------------------------------------------------------------------------- */

async function txPushAPI (txHex, path) {
  const API_PATH = path + 'broadcast'
  console.warn('Esplora API push tx hex:', API_PATH)

  try {
    const res = await axios.get(API_PATH, {
      params: {
        tx: content
      }
    })
    console.warn(res.data)
    return res.data // returns txid on success
  } catch (e) {
    console.warn(e) // e.response.data
    throw e
  }
}

module.exports = {
  getFeeEstimatesAPI,
  getHeightAPI,
  getRawTxAPI,
  getUTXOListAPI,
  getAddressTxHistoryAPI,
  txPushAPI
}
