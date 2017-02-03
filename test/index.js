const amorphParseSolcOuptut = require('../')
const solc = require('solc')
const chai = require('chai')
const SolcCompilationError = require('../lib/errors/SolcCompilationError')
const Amorph = require('Amorph')
const amorphHexPlugin = require('amorph-hex')

Amorph.loadPlugin(amorphHexPlugin)
Amorph.ready()

chai.should()

const GoodContractSol = `
pragma solidity ^0.4.8;

contract Good {
  function doThing(){}
}
`

const BadContractSol = `
pragma solidity ^0.4.8;
contract Bad {} *OH NO!*
`

const goodOutput = solc.compile(GoodContractSol)
const badOutput = solc.compile(BadContractSol)

describe('amorphParseSolcOuptut', () => {
  let parsed
  it('should throw SolcCompilationError for bad contract', () => {
    (() => {
      amorphParseSolcOuptut(badOutput, Amorph)
    }).should.throw(SolcCompilationError)
  })
  it('should parse goodOutput', () => {
    parsed = amorphParseSolcOuptut(goodOutput, Amorph)
  })
  describe('parsed', () => {
    it('should have Good contract', () => {
      parsed.should.have.keys(['Good'])
    })
    it('name should be Good', () => {
      parsed.Good.name.should.equal('Good')
    })
    it('code should be amorph', () => {
      parsed.Good.code.should.instanceof(Amorph)
    })
    it('codeHash should be amorph', () => {
      parsed.Good.codeHash.should.instanceof(Amorph)
    })
    it('runcode should be amorph', () => {
      parsed.Good.runcode.should.instanceof(Amorph)
    })
    it('abi should be a pojo', () => {
      parsed.Good.abi.should.be.instanceof(Object)
    })
  })
})
