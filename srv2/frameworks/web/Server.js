const express = require('express')
const http = require('http')
const debug = require('debug')

// web server sub components
const httpPresentedResponse = require('./middlewares/httpPresentedResponse')
const apiRouter = require('./routes/api')
const vaultRouter = require('./routes/vault')
const appPaths = require('../../config/app-paths')
const logServ = debug('serv:main')

class Server {
  constructor () {
    this._httpServer = null
  }

  /**
   * Création des instance des différents servers (express, http, ws)
   */
  async init ({
    dependencies
  }) {
    try {
      // Awilix : contruction des dépendences
      logServ('building dependencies')
      const container = dependencies.createContainer() // TODO async ou pas ?

      // Express : instancier les services http et websocket
      logServ('building server instance')
      const app = express()
      app.use(express.json({ limit: '48mb' }))
      const serv = http.createServer(app)

      logServ('path : checking working paths')
      appPaths.checkAppDataPaths()

      // Services
      logServ('database : service initialization')
      const DatabaseService = container.resolve('DatabaseService')
      await DatabaseService.init()

      logServ('vault : service initialization')
      const VaultService = container.resolve('VaultService')
      VaultService.setVaultPath(appPaths.getVaultPath())

      // Route http
      logServ('declaring webserver routes and middlewares')
      app.use(httpPresentedResponse)
      app.use('/game', express.static('./game'))
      app.use('/dist', express.static('./dist'))
      app.use('/editor', express.static('./apps/mapedit/index.html'))
      app.use('/website', express.static('./apps/website/index.html'))
      app.use('/api', apiRouter(container))
      app.use('/vault', vaultRouter(container))
      app.use('/', express.static('./apps/website/index.html'))

      this._httpServer = serv
    } catch (e) {
      logServ('server initialization failed')
      throw e
    }
  }

  /**
   * Mise à l'ecoute du serveur sur le port spécifié en paramètre
   * @param port {number}
   * @returns {Promise<undefined>}
   */
  listen (port) {
    return new Promise(resolve => {
      this._httpServer.listen(port, '0.0.0.0', () => {
        logServ('now listening on port ' + port)
        resolve()
      })
    })
  }
}

module.exports = Server
