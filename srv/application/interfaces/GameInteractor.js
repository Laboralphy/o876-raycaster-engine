class GameInteractor {
    publishLevel(name, data) {
        throw new Error('ERR_NOT_IMPLEMENTED')
    }
    async unpublishLevel(name, data) {
        throw new Error('ERR_NOT_IMPLEMENTED')
    }
    async getPublishedLevelList() {
        throw new Error('ERR_NOT_IMPLEMENTED')
    }
    async getUnusedTextureList() {
        throw new Error('ERR_NOT_IMPLEMENTED')
    }
}

module.exports = GameInteractor
