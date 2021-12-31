class Banishment {
  constructor (payload) {
    this.id = payload.id
    this.dateBegin = payload.dateBegin
    this.dateEnd = payload.dateEnd
    this.forever = payload.forever
    this.reason = payload.reason
    this.banner = payload.banner
  }
}

module.exports = Banishment
