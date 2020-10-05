/* -------------------------------------------------------------------------- */
/*                         page item creating helpers                         */
/* -------------------------------------------------------------------------- */

// remove html from strings
const sanitizeHTML = riskyText => {
  const temp = document.createElement('div')
  temp.textContent = String(riskyText)
  return temp.innerHTML
}

// div where new items are added
const renderRoot = document.getElementById('render')

// add section text
const addSection = ({ label = 'input value:', parent = renderRoot } = {}) => {
  const newLabel = document.createElement('div')
  newLabel.innerHTML = sanitizeHTML(label)
  newLabel.classList.add('lblSection')
  parent.appendChild(newLabel)
}

// create input field
const addField = ({
  label = 'input value:',
  initial = '',
  parent = renderRoot
} = {}) => {
  // create label
  const newLabel = document.createElement('div')
  newLabel.innerHTML = sanitizeHTML(label + ':')
  newLabel.classList.add('lblField')
  parent.appendChild(newLabel)
  // create text area
  const newInput = document.createElement('textarea')
  newInput.setAttribute('spellcheck', 'false')
  newInput.setAttribute('rows', '1')
  newInput.innerHTML = sanitizeHTML(initial)
  parent.appendChild(newInput)
}

const addInput = ({ parent = renderRoot, input = {}, vin = 0 } = {}) => {
  // create group's div
  const newGroup = document.createElement('div')
  newGroup.classList.add('input')
  parent.appendChild(newGroup)
  // inside:
  // add label describing input
  const newLabel = document.createElement('div')
  newLabel.innerHTML = sanitizeHTML(`Input #${vin}`)
  newLabel.classList.add('lblGroup')
  newGroup.appendChild(newLabel)
  // add field for hash, index, sequence, nonwitnessutxo
  addField({ label: 'value (sats)', initial: input.value, parent: newGroup })
  addField({
    label: "utxo's txid (hex)",
    initial: input.utxoTxid,
    parent: newGroup
  })
  addField({
    label: "utxo's vout (integer)",
    initial: input.utxoVout,
    parent: newGroup
  })
  addField({
    label: "utxo's raw transaction (hex)",
    initial: input.utxoTxHex,
    parent: newGroup
  })
  addField({
    label: 'nSequence (integer)',
    initial: input.nSequence,
    parent: newGroup
  })
  addField({
    label: 'redeemScript (hex)',
    initial: input.redeemScriptHex,
    parent: newGroup
  })
  addField({
    label: 'witnessScript (hex)',
    initial: input.witnessScriptHex,
    parent: newGroup
  })
}

const addOutput = ({ parent = renderRoot, output = {}, vout = 0 } = {}) => {
  // create group's div
  const newGroup = document.createElement('div')
  newGroup.classList.add('output')
  parent.appendChild(newGroup)
  // inside:
  // add label describing output
  const newLabel = document.createElement('div')
  newLabel.innerHTML = sanitizeHTML(`Output #${vout}`)
  newLabel.classList.add('lblGroup')
  newGroup.appendChild(newLabel)
  // add field for hash, index, sequence, nonwitnessutxo
  addField({ label: 'value (sats)', initial: output.value, parent: newGroup })
  addField({
    label: 'address (empty if OP_RETURN type)',
    initial: output.address,
    parent: newGroup
  })
  addField({
    label: 'Data to embed if OP_RETURN type (hex)',
    initial: output.dataHex,
    parent: newGroup
  })
}

const resetRender = ({ parent = renderRoot } = {}) => {
  parent.innerHTML = ''
}
