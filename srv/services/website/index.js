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
     * /            route principale, renvoie index.html
     * /app         route statique des scripts transpilés
     * /assets      route statique des assets
     * /online      route dynamique d'information renvoie {result: boolean} avec result = si le site est onlin ou en mode dev
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        application.get('/', (req, res) => {
            res.sendFile(getProjectFQN('website', 'index.html'));
        });
        application.use('/app', express.static(getProjectFQN('website', 'app')));
        application.use('/assets', express.static(getProjectFQN('website', 'assets')));

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

