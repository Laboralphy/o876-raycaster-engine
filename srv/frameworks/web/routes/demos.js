const express = require('express')
const promfs = require('../../../../libs/prom-fs')
const path = require('path')

function main (container) {
    const router = express.Router()

    router.get('/list', async (req, res) => {
        const aList = await promfs.ls(path.resolve('apps/demos'));
        res.json({list: aList.map(d => d.name)});
    })

    router.use('/', express.static('./apps/demos'))

    return router
}

module.exports = main
