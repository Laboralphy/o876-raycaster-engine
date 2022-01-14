class VaultController {
    constructor({
        GetLevelList,
        GetLevelPreview,
        LoadLevel,
        SaveLevel,
        DeleteLevel,
    }) {
        this.GetLevelList = GetLevelList
        this.GetLevelPreview = GetLevelPreview
        this.LoadLevel = LoadLevel
        this.SaveLevel = SaveLevel
        this.DeleteLevel = DeleteLevel
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
        if (this.DEV_MODE) {
            res.send.ok(await this.SaveLevel.execute(req.params.name, req.body))
        } else {
            res.send.forbidden()
        }
    }

    async deleteLevel(req, res) {
        if (this.DEV_MODE) {
            res.send.ok(await this.DeleteLevel.execute(req.params.name))
        } else {
            res.send.forbidden()
        }
    }
}

module.exports = VaultController
