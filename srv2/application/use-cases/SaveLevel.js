/**
 * Chargement des données d'un niveau
 */
class ExportLevel {
    constructor ({ LevelRepository }) {
        this.LevelRepository = LevelRepository
    }

    execute (name, data) {
        return this.LevelRepository.save(name, data)
    }
}

module.exports = ExportLevel
