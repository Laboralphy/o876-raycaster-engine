const express = require('express')

function main (container) {
  const router = express.Router()
  const PublishController = container.resolve('PublishController')

  router.put('/:name', (req, res) =>  {
    return PublishController.publishLevel(req, res)
  })

  router.delete('/:name', (req, res) =>  {
    return PublishController.unpublishLevel(req, res)
  })

  router.get('/', async (req, res) => {
    return PublishController.getPublishedLevelList(req, res)
  })

  router.get('/unused-textures', async (req, res) => {
    return PublishController.getUnusedTextures(req, res)
  })

  return router
}

module.exports = main
