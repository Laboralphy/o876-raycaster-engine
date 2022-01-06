function isValidNumber (x) {
  return typeof x === 'number'
}

function isValidString (x) {
  return typeof x === 'string'
}

function isValidObject (x) {
  return typeof x === 'object' && x !== null
}

function isValidNullableObject (x) {
  return typeof x === 'object'
}

function isValidArray (x) {
  return isValidObject(x) && Array.isArray(x)
}

function isValidEMailAddress (x) {
  return isValidString(x) && !!x.match(/^([-.a-zA-Z0-9_]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([-a-zA-Z0-9]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/)
}

module.exports = {
  isValidNumber,
  isValidString,
  isValidArray,
  isValidEMailAddress,
  isValidNullableObject,
  isValidObject
}
