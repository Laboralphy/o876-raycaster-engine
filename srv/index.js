require('dotenv').config()
const oPackage = require('../package.json')
const Server = require('./frameworks/web/Server')
const dependencies = require('./config/dependencies')
const debug = require('debug')
const appPaths = require('./config/app-paths')

const logServ = debug('serv:main')

logServ('%s v%s - %s', oPackage.name, oPackage.version, oPackage.description)

function checkProcessEnv () {
  logServ('checking environment variables')
  const CHECK_LIST = [
    'SERVER_PORT', 'GAME_PATH', 'SAVE_FILES_PATH', 'MAP_EDITOR'
  ]
  if (CHECK_LIST.some(c => {
    const bUndefined = process.env[c] === undefined
    if (bUndefined) {
      console.warn(c, 'variable is undefined')
    }
    return bUndefined
  })) {
    throw new Error('ERR_ESSENTIAL_ENV_VARIABLE_UNDEFINED')
  }
}


async function run () {
  checkProcessEnv()
  logServ('checking application working paths')
  await appPaths.checkAppDataPaths()

  const oServer = new Server()
  await oServer.init({
    dependencies
  })
  await oServer.listen(process.env.SERVER_PORT)
  return oServer
}

run()
  .then(() => logServ('accepting incoming connections...'))
  .catch(e => console.error(e))
