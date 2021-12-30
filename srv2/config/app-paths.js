const os = require('os')
const path = require('path')
const promFS = require('../../libs/prom-fs')
const mkdirp = require('mkdirp')

let WORKING_PATH = null

function getWorkingPath () {
    if (WORKING_PATH !== null) {
        return WORKING_PATH
    }
    let sPath = process.env.WORKING_PATH
    if (sPath.startsWith('~/')) {
        sPath = os.homedir() + sPath.substr(1)
    }
    WORKING_PATH = path.resolve(sPath)
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