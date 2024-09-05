/**
 * Publishes a level
 */
class PublishLevel {
    constructor ({ GameInteractor, LevelRepository }) {
        this.gameInteractor = GameInteractor
        this.levelRepository = LevelRepository
    }

    async execute (name) {
        const data = await this.levelRepository.load(name)
        await this.gameInteractor.publishLevel(name, data)
        return {
            success: true
        }
    }
}

module.exports = PublishLevel
