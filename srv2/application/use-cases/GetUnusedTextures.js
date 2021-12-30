class GetPublishedLevelList {
    constructor({ GameInteractor }) {
        this.gameInteractor = GameInteractor
    }

    async execute() {
        const unusedTextures = await this.gameInteractor.getUnusedTextureList()
        return { unusedTextures }
    }
}

module.exports = GetPublishedLevelList
