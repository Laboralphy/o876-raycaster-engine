class GetPublishedLevelList {
    constructor({ GameInteractor }) {
        this.gameInteractor = GameInteractor
    }

    execute() {
        return this.gameInteractor.getPublishedLevelList()
    }
}

module.exports = GetPublishedLevelList
