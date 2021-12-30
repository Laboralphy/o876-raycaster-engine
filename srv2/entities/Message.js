/**
 * @class Message
 * @property opcode {string}
 * @property valid {boolean}
 * @property arguments {string[]}
 */
class Message {
  constructor (payload) {
    this.opcode = payload.opcode
    this.valid = payload.valid
    this.arguments = payload.arguments
  }
}

module.exports = Message
