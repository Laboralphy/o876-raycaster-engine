/**
 * Chargement des données d'un niveau
 */
class UnpublishLevel {
    constructor ({ GameInteractor, LevelRepository }) {
        this.gameInteractor = GameInteractor
        this.levelRepository = LevelRepository
    }

    async execute (name) {
        await this.gameInteractor.unpublishLevel(name)
        return {
            success: true
        }
    }
}

module.exports = UnpublishLevel
