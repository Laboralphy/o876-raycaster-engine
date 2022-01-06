const path = require('path')
const promFS = require('../../libs/prom-fs')
const mkdirp = require('mkdirp')
const {homeAliasPath} = require('../../libs/home-alias-path');

let SAVE_FILES_PATH = null

function getWorkingPath () {
    if (SAVE_FILES_PATH !== null) {
        return SAVE_FILES_PATH
    }
    let sPath = process.env.SAVE_FILES_PATH
    SAVE_FILES_PATH = homeAliasPath(sPath)
    return SAVE_FILES_PATH
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
