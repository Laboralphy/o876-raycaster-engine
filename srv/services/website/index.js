const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');
const {getProjectFQN} = require('../../get-project-fqn');

/**
 * Ce service doit juste permettre au site web de fonctionner
 * C'est un site web classique avec un point d'entrée index.html
 * @type {Service}
 * @extends {ServiceAbstract}
 */
module.exports = class Service extends ServiceAbstract {

    /**
     * GET /               route principale, renvoie index.html
     * STATIC /app         route statique des scripts transpilés
     * STATIC /assets      route statique des assets du site web
     * GET /online         route dynamique d'information renvoie {result: boolean} avec result = si le site est onlin ou en mode dev
     * STATIC /dist        route statique pour les dist du websites
     * GET /favicon        route vers favicon
     *
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        application.get('/', (req, res) => {
            res.sendFile(getProjectFQN('apps/website', 'index.html'));
        });
        application.use('/app', express.static(getProjectFQN('apps/website', 'app')));
        application.use('/assets', express.static(getProjectFQN('apps/website', 'assets')));

        application.get('/online', (req, res) => {
            res.json({
                result: !CONFIG.getVariable('local_dev')
            });
        });
        application.use('/dist', express.static(getProjectFQN('dist')));
        application.get('/favicon.ico', (req, res) => {
            res.sendFile(getProjectFQN('favicon', 'favicon.png'));
        });
    }
};

