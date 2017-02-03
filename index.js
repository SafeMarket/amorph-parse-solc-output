const SolcCompilationError = require('./lib/errors/SolcCompilationError')
const arguguard = require('arguguard')
const soliditySha3 = require('solidity-sha3')
const Amorph = require('./lib/Amorph')

module.exports = function amorphParseSolcOuptut(output) {
  arguguard('amorphParseSolcOuptut', [Object], arguments)
  if(output.errors) {
    throw new SolcCompilationError(output.errors[0])
  }
  const contracts = {}
  Object.keys(output.contracts).forEach((contractName) => {
    _contract = output.contracts[contractName]
    contracts[contractName] = {
      name: contractName,
      code: new Amorph(_contract.bytecode, 'hex'),
      codeHash: new Amorph(soliditySha3.default(`0x${_contract.bytecode}`), 'hex.prefixed'),
      runcode: new Amorph(_contract.runtimeBytecode, 'hex'),
      abi: JSON.parse(_contract.interface)
    }
  })
  return contracts
}
