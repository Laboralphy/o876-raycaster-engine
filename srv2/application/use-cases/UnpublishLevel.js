/**
 * Chargement des données d'un niveau
 */
class UnpublishLevel {
    constructor ({ GameInteractor, LevelRepository }) {
        this.gameInteractor = GameInteractor
        this.levelRepository = LevelRepository
    }

    async execute (name) {
        return this.gameInteractor.unpublishLevel(name)
    }
}

module.exports = UnpublishLevel
