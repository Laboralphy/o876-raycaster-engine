// network interface controllers
const nics = require('os').networkInterfaces()
const { createGenerator } = require('../rnd-seq-36')

let nSeqNumber = null
let nLowerMacAddr = null

const genSeq1296 = createGenerator(2, 733)

function getMacAddress () {
  let retn
  for (const nic in nics) { // try to obtain the MAC address from the IPv6 scope-local address
    for (const index in nics[nic]) {
      const addr = nics[nic][index]
      if (!addr.internal) {
        if (addr.address.indexOf('fe80::') === 0) { // found scope-local
          retn = retn ||
            addr
              .address
              .slice(6)
              .split(':')
              .map((v, i, a) => parseInt(v, 16))
        }
      }
    }
  }
  if (!retn) { // no IPv6 so generate random MAC with multicast bit set
    const index = Math.pow(2, 16)
    retn = []
    retn.push(Math.floor(Math.random() * index) | 0x1000) // set multicast bit
    retn.push(Math.floor(Math.random() * index))
    retn.push(Math.floor(Math.random() * index))
    retn.push(Math.floor(Math.random() * index))
  }
  return retn
}

function getMacAddressLowerTwoBytes () {
  if (nLowerMacAddr === null) {
    nLowerMacAddr = getMacAddress().pop()
  }
  return nLowerMacAddr
}

function getNextSeqNumber () {
  if (nSeqNumber === null) {
    nSeqNumber = Math.floor(Math.random() * 1296)
  }
  return ++nSeqNumber
}

function generate () {
  const nSeconds = Math.floor(Date.now() / 1000)
  const nCounter = getNextSeqNumber()
  return nSeconds.toString(36) + genSeq1296(nCounter)
}

module.exports = generate
