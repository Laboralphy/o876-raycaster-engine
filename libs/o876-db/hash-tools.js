function utf8StrToByteArray (str) {
  const utf8 = []
  for (let i = 0; i < str.length; ++i) {
    let charcode = str.charCodeAt(i)
    if (charcode < 0x80) utf8.push(charcode)
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
        0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f))
    } else {
      ++i
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
      utf8.push(0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f))
    }
  }
  return utf8
}

function crcTable () {
  let c
  const crcTable = []
  for (let n = 0; n < 256; ++n) {
    c = n
    for (let k = 0; k < 8; ++k) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
    }
    crcTable[n] = c
  }
  return crcTable
}

const CRC_TABLE = crcTable()

function crc32 (str) {
  const astr = utf8StrToByteArray(str)
  let crc = 0 ^ (-1)
  for (let i = 0, l = astr.length; i < l; ++i) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ astr[i]) & 0xFF]
  }
  return (crc ^ (-1)) >>> 0
}

/**
 * crc16_mcrf4xx
 * data [0x01, 0xFF, 0x07, 0x19]
 */
function crc16 (str) {
  const astr = utf8StrToByteArray(str)
  // poly is 8408
  const CRC_POLY = 0x8408
  let crc = 0xFFFF
  for (let m = 0, l = astr.length; m < l; ++m) {
    crc ^= astr[m]
    for (let n = 0; n < 8; ++n) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ CRC_POLY
      } else {
        crc = (crc >> 1)
      }
    }
  }
  return crc ^ 0x0 & 0xFFFF
}

module.exports = {
  crc32,
  crc16
}
