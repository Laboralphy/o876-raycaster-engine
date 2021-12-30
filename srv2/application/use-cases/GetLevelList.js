/**
 * Obtention de la liste des niveaux précédement enregistré
 */
class GetLevelList {
    constructor ({ LevelRepository }) {
        /*
        29-12-2021 18:01
        il semblerai que LevelRepository ne soit pas déclaré : AwilixResolutionError: Could not resolve 'LevelRepository'.
        pourtant présent dans aliases.json
        mais... dans dépendencies.js on n'avais pas enregistré oAliases dans le container
         */
        this.levelRepository = LevelRepository
    }

    execute () {
        return this.levelRepository.list()
    }
}

module.exports = GetLevelList
