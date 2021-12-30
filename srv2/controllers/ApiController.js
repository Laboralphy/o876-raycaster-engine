class ApiController {
  constructor ({
    GetPublishedLevelList,
    GetUnusedTextures
  }) {
    this.GetPublishedLevelList = GetPublishedLevelList
    this.GetUnusedTextures = GetUnusedTextures
  }

  async getPublishedLevelList (req, res) {
    res.send.ok(await this.GetPublishedLevelList.execute())
  }

  async getUnusedTextures (req, res) {
    res.send.ok(await this.GetUnusedTextures.execute())
  }
}

module.exports = ApiController
