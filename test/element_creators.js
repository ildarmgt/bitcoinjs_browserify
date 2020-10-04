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

const addInput = ({ label = 'group', parent = renderRoot } = {}) => {
  // create group's div
  const newGroup = document.createElement('div')
  newGroup.classList.add('inputs')
  parent.appendChild(newGroup)
  // inside:
  // add label describing input
  const newLabel = document.createElement('div')
  newLabel.innerHTML = sanitizeHTML(label)
  newLabel.classList.add('lblGroup')
  newGroup.appendChild(newLabel)
  // add field for hash, index, sequence, nonwitnessutxo
  addField({ label: "utxo's txid (hex)", parent: newGroup })
  addField({ label: "utxo's index (integer)", parent: newGroup })
  addField({ label: "utxo's raw transaction (hex)", parent: newGroup })
  addField({
    label: 'nSequence (integer)',
    initial: '0xffffffff',
    parent: newGroup
  })
  addField({ label: 'redeemScript (hex)', parent: newGroup })
  addField({ label: 'witnessScript (hex)', parent: newGroup })
  addField({ label: 'value (sats)', parent: newGroup })
}

const addOutput = ({ label = 'group', parent = renderRoot } = {}) => {
  // create group's div
  const newGroup = document.createElement('div')
  newGroup.classList.add('outputs')
  parent.appendChild(newGroup)
  // inside:
  // add label describing output
  const newLabel = document.createElement('div')
  newLabel.innerHTML = sanitizeHTML(label)
  newLabel.classList.add('lblGroup')
  newGroup.appendChild(newLabel)
  // add field for hash, index, sequence, nonwitnessutxo
  addField({ label: 'address (empty if OP_RETURN type)', parent: newGroup })
  addField({ label: 'value (sats)', parent: newGroup })
  addField({ label: 'Data to embed if OP_RETURN type (hex)', parent: newGroup })
}

const resetRender = ({ parent = renderRoot } = {}) => {
  parent.innerHTML = ''
}
