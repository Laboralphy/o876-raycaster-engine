const express = require('express')
const http = require('http')
const debug = require('debug')

// web server sub components
const httpPresentedResponse = require('./middlewares/httpPresentedResponse')
const publishRouter = require('./routes/publish')
const vaultRouter = require('./routes/vault')
const demosRouter = require('./routes/demos')
const faviconRouter = require('./routes/favicon')
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
      app.use('/game', express.static(process.env.RCGDK_GAME_PATH))
      app.use('/dist', express.static('./dist'))

      const RCGDK_MAP_EDITOR = container.resolve('RCGDK_MAP_EDITOR')
      app.get('/editor/status', (req, res) => {
        res.json({ status: RCGDK_MAP_EDITOR })
        res.end()
      })
      if (RCGDK_MAP_EDITOR) {
        app.use('/editor', express.static('./apps/mapedit/index.html'))
      }
      app.use('/ui', express.static('./apps/website/index.html'))
      app.use('/publish', publishRouter(container))
      app.use('/vault', vaultRouter(container))
      app.use('/demo', demosRouter(container))
      app.use('/favicon.ico', faviconRouter(container))
      app.get('/', (req, res) => {
        res.redirect('/ui')
      })
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
