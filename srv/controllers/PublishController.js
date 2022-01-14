class PublishController {
  constructor ({
    GetPublishedLevelList,
    GetUnusedTextures,
    PublishLevel,
    UnpublishLevel,
    DEV_MODE
  }) {
    this.GetPublishedLevelList = GetPublishedLevelList
    this.GetUnusedTextures = GetUnusedTextures
    this.PublishLevel = PublishLevel
    this.UnpublishLevel = UnpublishLevel
    this.DEV_MODE = DEV_MODE
  }

  async getPublishedLevelList (req, res) {
    res.send.ok(await this.GetPublishedLevelList.execute())
  }

  async getUnusedTextures (req, res) {
    res.send.ok(await this.GetUnusedTextures.execute())
  }

  async publishLevel(req, res) {
    if (this.DEV_MODE) {
      res.send.ok(await this.PublishLevel.execute(req.params.name))
    } else {
      res.send.forbidden()
    }
  }

  async unpublishLevel(req, res) {
    if (this.DEV_MODE) {
      res.send.ok(await this.UnpublishLevel.execute(req.params.name))
    } else {
      res.send.forbidden()
    }
  }
}

module.exports = PublishController
