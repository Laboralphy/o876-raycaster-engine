/**
 * Chargement des données d'un niveau
 */
class ExportLevel {
    constructor ({ LevelRepository }) {
        this.LevelRepository = LevelRepository
    }

    async execute (name, data) {
        await this.LevelRepository.save(name, data)
        return {
            success: true
        }
    }
}

module.exports = ExportLevel
