class PublishController {
  constructor ({
    GetPublishedLevelList,
    GetUnusedTextures,
    PublishLevel,
    UnpublishLevel,
    RCGDK_MAP_EDITOR
  }) {
    this.GetPublishedLevelList = GetPublishedLevelList
    this.GetUnusedTextures = GetUnusedTextures
    this.PublishLevel = PublishLevel
    this.UnpublishLevel = UnpublishLevel
    this.RCGDK_MAP_EDITOR = RCGDK_MAP_EDITOR
  }

  async getPublishedLevelList (req, res) {
    res.send.ok(await this.GetPublishedLevelList.execute())
  }

  async getUnusedTextures (req, res) {
    res.send.ok(await this.GetUnusedTextures.execute())
  }
  
  async publishLevel(req, res) {
    if (this.RCGDK_MAP_EDITOR) {
      res.send.ok(await this.PublishLevel.execute(req.params.name))
    } else {
      res.send.forbidden()
    }
  }

  async unpublishLevel(req, res) {
    if (this.RCGDK_MAP_EDITOR) {
      res.send.ok(await this.UnpublishLevel.execute(req.params.name))
    } else {
      res.send.forbidden()
    }
  }
}

module.exports = PublishController
