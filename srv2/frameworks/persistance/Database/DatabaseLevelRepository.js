const ILevelPersist = require('../../../application/interfaces/LevelRepository')
// const JsonBlobz = require('../../../../libs/json-blobz');

class DatabaseLevelRepository extends ILevelPersist {
    constructor({ DatabaseService }) {
        super();
        this._database = DatabaseService
    }

    save (name, data) {
        if (!('dates' in data)) {
            data.dates = {
                created: Date.now()
            }
        }
        data.dates.modified = Date.now()
        return this._database.collections.levels.save(name, data)
    }

    load (name, data) {
        return this._database.collections.levels.get(name)
    }

    remove (name) {
        return this._database.collections.levels.remove(name)
    }

    async list (name) {
        const aKeys = this._database.collections.levels.keys
        const aList = []
        for (const key of aKeys) {
            const d = await this.load(key)
            aList.push({
                name: key,
                date: d.dates.modified
            })
        }
        return aList
    }
}

module.exports = DatabaseLevelRepository
