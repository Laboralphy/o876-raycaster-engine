/**
 * Obtention de la liste des niveaux précédement enregistré
 */
class GetLevelPreview {
    constructor ({ LevelRepository }) {
        this.levelRepository = LevelRepository
    }

    execute (name) {
        return this.levelRepository.getPreview(name)
    }
}

module.exports = GetLevelPreview
