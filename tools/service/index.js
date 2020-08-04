/**
 * Service
 *
 * @description This is the main entry of the web service. This service offers pages that describes the project,
 * gives access to the map editor program, manages the local game project...
 *
 * @author Raphaël Marandet
 * @email raphael.marandet(at)gmail(dot)com
 * @date 2019-06-13
 */


const express = require('express');
const path = require('path');
const util = require('util');
const fs = require('fs');

// PASSPORT.JS imports and dependencies .... "unobtrusive" ???
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const FileStore = require('session-file-store')(session);

const persist = require('./persist');
const LZ = require('./level-zip');
const pm = require('./project-mgr');

const app = express();

const CONFIG = require('./config');
const O876_RC_ROOT_PATH = path.resolve(CONFIG.getVariable('base_path'));

const readdir = util.promisify(fs.readdir);


function print(...args) {
    console.log(...args);
}

function getProjectFQN(...aPath) {
    return path.join(O876_RC_ROOT_PATH, ...aPath);
}

function initFavicon() {
    app.get('/favicon.ico', (req, res) => {
        print('serving favicon');
        res.sendFile(getProjectFQN('favicon', 'favicon.png'));
    });
}

/**
 * Returns the client identity
 * @param req {Request}
 * @return {{id: string, vaultPath: string}}
 */
function getUserAuth(req) {
    if (!!CONFIG.getVariable('local_dev')) {
        return {
            id: 'local',
            displayName: 'local',
            vaultPath: 'local'
        };
    } else {
        return req.user;
    }
}

/**
 * inits the map editor sub-service
 * and the map editor persistance sub-service
 */
function initMapEditor() {
    app.use(express.json({limit: '48mb'})); // for parsing application/json
    app.use('/mapedit', express.static(getProjectFQN('tools', 'mapedit')));
    persist.setVaultPath(CONFIG.getVariable('vault_path'));

    // list levels
    app.get('/vault', (req, res) => {
        const oUser = getUserAuth(req);
        persist.listLevels(oUser.vaultPath)
            .then(r => res.json(r))
            .catch(e => {
                console.error('GET /vault - error');
                console.error(e);
            })
    });

    // loads a level for the map editor
    app.get('/vault/:name.json', (req, res) => {
        const oUser = getUserAuth(req);
        const name = req.params.name;
        persist.loadLevel(oUser.vaultPath, name).then(r => res.json(r));
    });

    // load a preview thumbnail of a level
    app.get('/vault/:name.jpg', async (req, res) => {
        const oUser = getUserAuth(req);
        const name = req.params.name;
        const filename = await persist.getLevelPreview(oUser.vaultPath, name);
        res.sendFile(getProjectFQN(filename));
    });

    // get the zipped version of a level
    app.get('/vault/:name.zip', async (req, res) => {
        try {
            const oUser = getUserAuth(req);
            const name = req.params.name;
            const data = await persist.loadLevel(oUser.vaultPath, name);
            const archive = await LZ.buildZip(name, data);
            res.download(archive.filename);
        } catch (e) {
            await res.json({status: 'error', error: e.message});
        }
    });

    // save level in the vault under a specified name
    app.post('/vault/:name', async (req, res) => {
        try {
            const oUser = getUserAuth(req);
            const name = req.params.name;
            const {data} = req.body;
            const r = await persist.saveLevel(oUser.vaultPath, name, data);
            await res.json(r)
        } catch (e) {
            await res.json({status: 'error', error: e.message});
        }
    });

    // delete a specified level from the vault
    app.delete('/vault/:name', (req, res) => {
        const oUser = getUserAuth(req);
        const name = req.params.name;
        persist.removeLevel(oUser.vaultPath, name).then(r => res.json(r));
    });

    // export this level to the game assets
    // only local work maybe exported
    // not user-based (online)
    app.get('/export/:name', async (req, res) => {
        try {
            const oUser = getUserAuth(req);
            const name = req.params.name;
            const data = await persist.loadLevel(oUser.vaultPath, name);
            await LZ.exportLevel(name, data, {
                textures: CONFIG.getVariable('texture_path'),
                level: CONFIG.getVariable('level_path'),
                game: CONFIG.getVariable('game_path')
            });
            await res.json({status: 'done'});
        } catch (e) {
            console.error(e);
            await res.json({status: 'error', error: e.message});
        }
    });
}

/**
 * inits the examples sub-service to give access to all examples and demos
 */
function initExamples() {
    const sExamplePath = getProjectFQN('examples');
    app.use('/examples', express.static(sExamplePath));
    app.get('/examples-list', async (req, res) => {
        // get a list of all example
        const aList = await readdir(sExamplePath);
        return res.json({list: aList});
    });
}

const USERS_STORE = {};

function initPassport() {
// Uses the LocalStrategy for PASSPORT.JS
    passport.use(new LocalStrategy(
        function(username, password, done) {
            /*
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
            */
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


/**
 * inits the web site sub service
 * this is a User Interface to easily acces to all Raycaster components such as :
 * - examples
 * - map editor
 */
function initWebSite() {
    app.get('/', (req, res) => {
        res.sendFile(getProjectFQN('tools', 'website', 'index.html'));
    });
    app.use('/app', express.static(getProjectFQN('tools', 'website', 'app')));
    app.use('/assets', express.static(getProjectFQN('tools', 'website', 'assets')));

    // returns a visual representation of the connected user
    app.get('/online', (req, res) => {
        res.json({
            result: !CONFIG.getVariable('local_dev')
        });
    });
}

/**
 * inits the dist sub service
 * provides access to all packed scripts inside the DIST folder
 */
function initDist() {
    app.use('/dist', express.static(getProjectFQN('dist')));
}

/**
 * create the game project tree
 */
function initGameProject() {
    const GAME_ACTION_PREFIX = '/game';

    // declare the assets directory as static resources
    app.use(GAME_ACTION_PREFIX + '/assets', express.static(getProjectFQN(CONFIG.getVariable('game_path'), 'assets')));

    // declare the dist directory as static resources
    app.use(GAME_ACTION_PREFIX + '/dist', express.static(getProjectFQN(CONFIG.getVariable('game_path'), 'dist')));

    // get a list of published levels
    app.get(GAME_ACTION_PREFIX + '/levels', async (req, res) => {
        try {
            const oUser = getUserAuth(req);
            console.log(oUser);
            const aPublished = await pm.getPublishedLevels();
            const aVault = await persist.listLevels(oUser.vaultPath);
            aPublished.forEach(l => {
                l.invault = aVault.findIndex(x => x.name === l.name) >= 0;
            });
            aVault.forEach(l => {
                l.exported = false;
                l.preview = '/vault/' + l.name + '.jpg';
                l.invault = true;
            });
            const aLevels = aPublished.concat(aVault);
            await res.json(aLevels);
        } catch (e) {
            await res.json({status: 'error', error: e.message});
        }
    });

    // unpublish a specified level
    app.delete(GAME_ACTION_PREFIX + '/level/:name', (req, res) => {
        pm
            .unpublishLevel(req.params.name)
            .then(() => res.json({status: 'done'}))
            .catch(e => res.json({status: 'error', error: e.message}));
    });

    // redirection -> launch the game
    app.get(GAME_ACTION_PREFIX + '/', (req, res) => {
        res.redirect(301, GAME_ACTION_PREFIX + '/index.html');
    });

    // launch the game
    app.get(GAME_ACTION_PREFIX + '/index.html', (req, res) => {
        res.sendFile(getProjectFQN(CONFIG.getVariable('game_path'), 'index.html'));
    });

    pm.run(CONFIG.getVariable('base_path'));
}


function run(options) {

    const gpo = x => x in options ? options[x] : undefined;
    const gpe = x => x in process.env ? process.env[x] : undefined;
    const gpoe = (a, x, y, z) => {
        let r;
        r = gpo(x);
        if (r !== undefined) {
            CONFIG.setVariable(a, r);
            return;
        }
        r = gpe(y);
        if (r !== undefined) {
            CONFIG.setVariable(a, r);
            return;
        }
        r = z;
        CONFIG.setVariable(a, r);
    };

    print('---------------------------------');
    print('O876 Raycaster Engine Web Service');
    print('version: ' + process.env.npm_package_version);
    print('Laboralphy');
    print('---------------------------------');
    print(' ');

    CONFIG.setVariable('base_path', options.base_path);
    gpoe('port', 'port', 'SERVER_PORT', 80);
    gpoe('vault_path', 'vault_path', 'VAULT_PATH', '');
    gpoe('game_path', 'game_path', 'GAME_PATH', '');

    initGameProject();
    initFavicon();
    initMapEditor();
    initExamples();
    initDist();
    if (!CONFIG.getVariable('local_dev')) {
        initPassport();
    }
    initWebSite();

    app.listen(CONFIG.getVariable('port'));
    print('base location :', options.base_path);
    print('vault location :', CONFIG.getVariable('vault_path'));
    print('game project location :', CONFIG.getVariable('game_path'));
    print('server port :', CONFIG.getVariable('port'));
    print('action prefix :', 'game');
    print('website url : http://localhost:' + CONFIG.getVariable('port') + '/');
    print('local development : ' + (CONFIG.getVariable('local_dev') ? 'yes' : 'nope, online service'));
    print('service is now listening...');
}

module.exports = {
    run
};