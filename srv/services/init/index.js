const session = require("express-session");
const bodyParser = require("body-parser");
const FileStore = require('session-file-store')(session);

const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');

const {getProjectFQN} = require('../../get-project-fqn');

/**
 * @extends ServiceAbstract
 */
class Service extends ServiceAbstract {

    init() {
    }

    /**
     * does not register any routes
     *
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        const fileStoreOptions = {
            path: getProjectFQN(process.env.SESSION_PATH),
            ttl: 3600 * 24
        };

        // use sessions with file-store
        app.use(session({
            store: new FileStore(fileStoreOptions),
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        }));
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json({
            limit: '48Mb'
        }));
    }
}

module.exports = Service;
