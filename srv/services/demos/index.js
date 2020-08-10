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
     * GET /demos            a list of built demos
     * GET /demo/:iddemo     a static route to a specific demo folder
     *
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        const sExamplePath = getProjectFQN('demos');
        app.get('/demos', async (req, res) => {
            // get a list of all example
            const aList = await promfs.ls(sExamplePath);
            return res.json({list: aList});
        });
        app.use('/demo', express.static(sExamplePath));
    }
};
