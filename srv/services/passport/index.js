const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const FileStore = require('session-file-store')(session);
const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');

const {getProjectFQN} = require('../../get-project-fqn');
const {getUserAuth} = require('../../get-user-auth');

/**
 * @extends ServiceAbstract
 */
class Service extends ServiceAbstract {

    init() {
        this.oUserStore = {};
    }

    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        const USERS_STORE = this.oUserStore;
        passport.use(new LocalStrategy(
            function(username, password, done) {
                // a partir du username/password
                // déterminer l'identité du client
                if (username === password) {
                    const oUser = {
                        id: 'user-' + username,
                        vaultPath: 'user-' + username,
                        displayName: username
                    };
                    USERS_STORE[oUser.id] = oUser;
                    return done(null, oUser);
                } else {
                    return done(null, false, { message: 'incorrect username/password'});
                }
            }
        ));

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // retrieve user instance from id
        passport.deserializeUser(function(id, done) {
            if (id in USERS_STORE) {
                done(null, USERS_STORE[id]);
            } else {
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
            function(req, res) {
                // If this function gets called, authentication was successful.
                // `req.user` contains the authenticated user.
                res.redirect('/');
            }
        );

        // returns a visual representation of the connected user
        app.get('/userinfo', (req, res) => {
            const oUser = getUserAuth(req);
            if (!!oUser) {
                return res.json({
                    auth: true,
                    name: oUser.displayName
                });
            } else {
                return res.json({
                    auth: false
                });
            }
        });

        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });

    }
}

module.exports = Service;
