class FileLevelRepository {
    constructor ({ VaultService }) {
        this.VaultService = VaultService
        this.USER = 'local'
    }

    /**
     * saving a level in the file system (thru VaultFS)
     * @param name {string} level name
     * @param data {*} level data
     */
    save (name, data) {
        return this.VaultService.saveLevel(this.USER, name, data)
    }

    /**
     * Load level data from the file system
     * @param name {string} level name     * @returns {*}
     */
    load (name) {
        return this.VaultService.loadLevel(this.USER, name)
    }

    /**
     * physically remove a level from the file system
     * @param name {string}
     * @returns {Promise<{status: string}>|Promise<{status: string}>|*}
     */
    remove (name) {
        return this.VaultService.removeLevel(this.USER, name)
    }

    /**
     * retreive the list of previously saved levels
     */
    list () {
        return this.VaultService.listLevels(this.USER)
    }

    getPreview (name) {
        return this.VaultService.getLevelPreview(this.USER, name)
    }
}

module.exports = FileLevelRepository