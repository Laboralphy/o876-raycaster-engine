/**
 * Chargement des données d'un niveau
 */
class PublishLevel {
    constructor ({ GameInteractor, LevelRepository }) {
        this.gameInteractor = GameInteractor
        this.levelRepository = LevelRepository
    }

    async execute (name) {
        const data = await this.levelRepository.load(name)
        return this.gameInteractor.publishLevel(name, data)
    }
}

module.exports = PublishLevel
