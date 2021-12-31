const express = require('express')
const bodyParser = require('body-parser')

function main (container) {
    const VaultController = container.resolve('VaultController')
    const router = express.Router()

    // Obtenir la liste des niveaux
    router.get('/', (req, res) => {
        return VaultController.getLevelList(req, res)
    })

    // Obtenir la miniature des niveaux
    router.get('/:name.jpg', (req, res) => {
        return VaultController.getLevelPreview(req, res)
    })

    // Chargement d'un niveau
    router.get('/:name.json', (req, res) => {
        return VaultController.loadLevel(req, res)
    })

    router.put('/:name', (req, res) =>  {
        return VaultController.saveLevel(req, res)
    })

    router.put('/publish/:name', (req, res) =>  {
        return VaultController.publishLevel(req, res)
    })

    router.delete('/publish/:name', (req, res) =>  {
        return VaultController.unpublishLevel(req, res)
    })

    router.delete('/:name', (req, res) =>  {
        return VaultController.deleteLevel(req, res)
    })
    return router
}

module.exports = main
