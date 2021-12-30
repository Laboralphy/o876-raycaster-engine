class GetPublishedLevelList {
    constructor({ GameInteractor }) {
        this.gameInteractor = GameInteractor
    }

    async execute() {
        const levels = await this.gameInteractor.getPublishedLevelList()
        return { levels }
    }
}

module.exports = GetPublishedLevelList
