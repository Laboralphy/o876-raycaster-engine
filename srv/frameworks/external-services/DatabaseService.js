const db = require('../../../libs/o876-db')
const config = require('../../config/database')

let oManager = null

class DatabaseService {
  async init () {
    const oManager = new db.Manager()
    await oManager.init(config)
    return oManager
  }

  async getManager () {
    if (!oManager) {
      oManager = await this.init()
    }
    return oManager
  }
}

module.exports = DatabaseService
