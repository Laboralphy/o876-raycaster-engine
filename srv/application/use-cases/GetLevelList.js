/**
 * Get a list of previously stored levels
 */
class GetLevelList {
    constructor ({ LevelRepository }) {
        this.levelRepository = LevelRepository
    }

    /**
     *
     * @returns {Promise<>}
     */
    execute () {
        return this.levelRepository.list()
    }
}

module.exports = GetLevelList
