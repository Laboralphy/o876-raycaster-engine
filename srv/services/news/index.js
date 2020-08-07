const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');
const {getProjectFQN} = require('../../get-project-fqn');
const promfs = require('../../../libs/prom-fs');
const path = require('path');

/**
 * Ce service permet de mettre à disposition des news
 * @type {Service}
 * @extends {ServiceAbstract}
 */
module.exports = class Service extends ServiceAbstract {

    /**
     * /news        route vers les news
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        try {
            const sNewsPath = CONFIG.getVariable('news_path');
            console.log('news path :', sNewsPath);
            if (!!sNewsPath) {
                application.use('/news', express.static(getProjectFQN(sNewsPath)));
            }
        } catch (e) {
            // no news_path variable : no news
        }
    }
};
