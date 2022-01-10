const express = require('express')
const path = require('path')

function main (container) {
    const router = express.Router()

    router.get('/', async (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../../../favicon/favicon.png'))
    })

    return router
}

module.exports = main
