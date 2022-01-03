const path = require('path')
const promFS = require('../../libs/prom-fs')
const mkdirp = require('mkdirp')
const {homeAliasPath} = require('../../libs/home-alias-path');

let WORKING_PATH = null

function getWorkingPath () {
    if (WORKING_PATH !== null) {
        return WORKING_PATH
    }
    let sPath = process.env.WORKING_PATH
    WORKING_PATH = homeAliasPath(sPath)
    return WORKING_PATH
}

function getDatabasePath () {
    return path.join(getWorkingPath(), 'database')
}

function getVaultPath () {
    return path.join(getWorkingPath(), 'vault')
}

async function buildPathIfNotExist (sPath) {
    if (!await promFS.stat(sPath)) {
        await mkdirp(sPath)
    }
}

async function checkAppDataPaths () {
    await buildPathIfNotExist(getWorkingPath())
    await buildPathIfNotExist(getDatabasePath())
    await buildPathIfNotExist(getVaultPath())
}

module.exports = {
    checkAppDataPaths,
    buildPathIfNotExist,
    getDatabasePath,
    getWorkingPath,
    getVaultPath
}
