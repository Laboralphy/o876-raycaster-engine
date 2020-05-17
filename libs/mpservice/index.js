const express = require('express');
const httpServer = express();
const http = require('http').Server(httpServer);
const io = require('socket.io')(http);
const path = require('path');


const config = require('./config-loader/index');
const logger = require('./logger/index');
const ServiceManager = require('./service-manager/index');
const STRINGS = require('./consts/strings');

const ServiceLogin = require('./services/login');
const ServiceTxat = require('./services/chat');
const ServiceGame = require('./services/engine');

const Game = require('./engine-process/Core');

class Application {

	constructor() {
		logger.log(STRINGS.service.hello);
	}

	/**
	 * Lancement du serveur
	 * @returns {Promise<any>}
	 */
	async listen() {
		return new Promise(function(resolve) {
			let nPort = config.server.port;
			http.listen(nPort, function() {
                logger.log(STRINGS.service.listening, nPort);
				resolve();
			});
		});
	}

	runService() {
        let service = new ServiceManager();
        service
			.plugin(new ServiceLogin())
			.plugin(new ServiceTxat())
			.plugin(new ServiceGame(new Game()))
		;
        io.on('connection', socket => service.run(socket));
	}

	/**
	 * Definition des routes du server HTTP
	 * @param sRoot {string} répertoir racine
	 */
	setRoutes(sRoot) {
		// root
		httpServer.get('/', function(req, res) {
			res.sendFile(path.resolve(sRoot, 'index.html'));
		});
		// app.js
		httpServer.get('/scripts', function(req, res) {
			res.sendFile(path.resolve(sRoot, 'scripts/dist/app.js'));
		});
		httpServer.get('/app.js.map', function(req, res) {
			res.sendFile(path.resolve(sRoot, 'scripts/dist/app.js.map'));
		});
        httpServer.get('/raycaster', function(req, res) {
            res.sendFile(path.resolve(sRoot, 'scripts/raycaster/libraycaster.js'));
        });
		httpServer.use('/resources', express.static(path.resolve(sRoot, 'resources')));
	}
}

module.exports = Application;
