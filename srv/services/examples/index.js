const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');
const {getProjectFQN} = require('../../get-project-fqn');
const promfs = require('../../../libs/prom-fs');

/**
 * Ce service doit juste permettre au site web de fonctionner
 * C'est un site web classique avec un point d'entrée index.html
 * @type {Service}
 * @extends {ServiceAbstract}
 */
module.exports = class Service extends ServiceAbstract {

    /**
     * /            route principale, renvoie index.html
     * /app         route statique des scripts transpilés
     * /assets      route statique des assets
     * /online      route dynamique d'information renvoie {result: boolean} avec result = si le site est onlin ou en mode dev
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        const sExamplePath = getProjectFQN('examples');
        app.use('/news', express.static(sExamplePath));
        app.get('/examples-list', async (req, res) => {
            // get a list of all example
            const aList = await promfs.ls(sExamplePath);
            return res.json({list: aList});
        });
    }
};
