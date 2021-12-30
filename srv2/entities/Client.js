/**
 * @class Client
 * @property id {number}
 * @property state {string}
 * @property socket {WebSocket}
 * @property user {User}
 * @property character {object}
 */
class Client {
  constructor (payload) {
    this.id = payload.id
    this.state = payload.state
    this.type = payload.type
    this.socket = payload.socket
    this.uid = payload.uid
    this.uname = payload.uname
  }
}

module.exports = Client
