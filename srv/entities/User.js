/**
 * @typedef Banishment {object}
 * @property dateBan {number}
 * @property dateUnban {number}
 * @property reason {string}
 * @property by {string}
 *
 * @class User
 * @property id {number}
 * @property username {string}
 * @property password {string}
 * @property email {string}
 * @property dateCreation {number}
 * @property dateLastLogin {number}
 * @property role {string[]}
 * @property banishment {Banishment}
 */
class User {
  constructor (payload) {
    this.id = payload.id
    this.name = payload.name
    this.password = payload.password
    this.email = payload.email
    this.dateCreation = payload.dateCreation
    this.dateLastLogin = payload.dateLastLogin
    this.roles = payload.roles || []
    this.banishment = ''
  }
}

module.exports = User
