/**
 * Chargement des données d'un niveau
 */
class LoadLevel {
    constructor ({ LevelRepository }) {
        this.LevelRepository = LevelRepository
    }

    execute (name) {
        return this.LevelRepository.load(name)
    }
}

module.exports = LoadLevel
