/**
 * Chargement des données d'un niveau
 */
class DeleteLevel {
    constructor ({ LevelRepository }) {
        this.LevelRepository = LevelRepository
    }

    execute (name, data) {
        return this.LevelRepository.remove(name, data)
    }
}

module.exports = DeleteLevel
