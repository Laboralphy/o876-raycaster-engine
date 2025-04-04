const express = require('express')

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

    router.delete('/:name', (req, res) =>  {
        return VaultController.deleteLevel(req, res)
    })
    return router
}

module.exports = main
