/**
 * Level deletion : will remove the level specified by "name"
 */
class DeleteLevel {
    constructor ({ LevelRepository }) {
        this.LevelRepository = LevelRepository
    }

    /**
     * Call LevelRepository and remove level identified by "name"
     * return {success: true} if level is effectively removed
     * @param name {string} Level name to remove
     * @returns {Promise<{success: boolean}>}
     */
    async execute (name) {
        await this.LevelRepository.remove(name)
        return {
            success: true
        }
    }
}

module.exports = DeleteLevel
