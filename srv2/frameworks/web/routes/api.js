const express = require('express')

function main (container) {
  const router = express.Router()
  const oApiController = container.resolve('ApiController')
  router.get('/levels', async (req, res) => {
    res.send.ok(await oApiController.getPublishedLevelList(req, res))
  })
  router.get('/unused-textures', async (req, res) => {
    res.send.ok(await oApiController.getUnusedTextures(req, res))
  })
  return router
}

module.exports = main
