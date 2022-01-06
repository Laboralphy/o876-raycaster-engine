function getType (x, bReduced) {
  if (x === null) {
    return 'null'
  }
  const sType = typeof x
  if (sType === 'object') {
    if (x instanceof Date) {
      return 'date'
    } else if (x instanceof RegExp) {
      return 'regexp'
    } else if (Array.isArray(x)) {
      return 'array'
    } else {
      return 'object'
    }
  } else {
    return sType
  }
}

module.exports = {
  getType
}
