class VaultController {
    constructor({
        GetLevelList,
        GetLevelPreview,
        LoadLevel,
        SaveLevel,
        DeleteLevel,
        PublishLevel,
        UnpublishLevel
    }) {
        this.GetLevelList = GetLevelList
        this.GetLevelPreview = GetLevelPreview
        this.LoadLevel = LoadLevel
        this.SaveLevel = SaveLevel
        this.DeleteLevel = DeleteLevel
        this.PublishLevel = PublishLevel
        this.UnpublishLevel = UnpublishLevel
    }

    async getLevelList(req, res) {
        const levels = await this.GetLevelList.execute()
        res.send.ok(levels)
    }

    async getLevelPreview(req, res) {
        const oImage = await this.GetLevelPreview.execute(req.params.name)
        if (oImage) {
            res.sendFile(oImage)
        } else {
            res.send.notFound()
        }
    }

    async loadLevel(req, res) {
        res.send.ok(await this.LoadLevel.execute(req.params.name))
    }

    async saveLevel(req, res) {
        res.send.ok(await this.SaveLevel.execute(req.params.name, req.body))
    }

    async deleteLevel(req, res) {
        res.send.ok(await this.DeleteLevel.execute(req.params.name))
    }

    async publishLevel(req, res) {
        res.send.ok(await this.PublishLevel.execute(req.params.name))
    }

    async unpublishLevel(req, res) {
        res.send.ok(await this.UnpublishLevel.execute(req.params.name))
    }
}

module.exports = VaultController
