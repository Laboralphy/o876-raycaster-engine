const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const FileStore = require('session-file-store')(session);
const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');
const UserManager = require('../../user-mgr');

const {getProjectFQN} = require('../../get-project-fqn');
const {getUserAuth} = require('../../get-user-auth');

/**
 * @extends ServiceAbstract
 */
class Service extends ServiceAbstract {

    init() {
        this.oUserManager = new UserManager();
        this.oUserManager.vaultPath = CONFIG.getVariable('vault_path');
    }

    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        passport.use(new LocalStrategy(
            async (username, password, done) => {
                // a partir du username/password
                // déterminer l'identité du client
                const u = await this.oUserManager.findUser(username, password);
                if (!!u) {
                      return done(null, u);
                } else {
                    return done(null, false, { message: 'incorrect username/password'});
                }
            }
        ));

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        // retrieve user instance from id
        passport.deserializeUser(async (id, done) => {
            try {
                const oUser = await this.oUserManager.getUserData(id);
                done(null, oUser);
            } catch (e) {
                done(null, false);
            }
        });

        const fileStoreOptions = {
            path: getProjectFQN(process.env.SESSION_PATH),
            ttl: 3600 * 24
        };

        app.use(session({
            store: new FileStore(fileStoreOptions),
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.post('/login',
            passport.authenticate('local'),
            (req, res) => {
                // If this function gets called, authentication was successful.
                // `req.user` contains the authenticated user.
                res.redirect('/');
            }
        );

        // returns a visual representation of the connected user
        app.get('/user.json', (req, res) => {
            const oUser = getUserAuth(req);
            if (!!oUser) {
                return res.json({
                    auth: true,
                    name: oUser.name,
                    date: oUser["date-creation"]
                });
            } else {
                return res.json({
                    auth: false
                });
            }
        });

        app.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });

    }
}

module.exports = Service;
