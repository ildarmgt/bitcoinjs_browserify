// example requested instructions that specify 1 receiving address and 1 spending address
const exampleRequestInstructions = {
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
