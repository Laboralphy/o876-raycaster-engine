/**
 * Chargement des données d'un niveau
 */
class DeleteLevel {
    constructor ({ LevelRepository }) {
        this.LevelRepository = LevelRepository
    }

    async execute (name, data) {
        await this.LevelRepository.remove(name, data)
        return {
            success: true
        }
    }
}

module.exports = DeleteLevel
