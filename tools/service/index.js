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
const AppRootPath = require('app-root-path');

const persist = require('./persist');
const LZ = require('./level-zip');
const pm = require('./project-mgr');

const app = express();

const O876_RC_ROOT_PATH = path.resolve(__dirname, '../../');
const CONFIG = require('./config');

const readdir = util.promisify(fs.readdir);

function print(...args) {
    console.log(...args);
}


function initFavicon() {
    app.get('/favicon.ico', (req, res) => {
        print('serving favicon');
        res.sendFile(path.resolve(__dirname, 'favicon/favicon.png'));
    });
}

/**
 * inits the map editor sub-service
 * and the map editor persistance sub-service
 */
function initMapEditor() {
    app.use(express.json({limit: '48mb'})); // for parsing application/json
    app.use('/mapedit', express.static(path.resolve(O876_RC_ROOT_PATH, 'tools/mapedit')));
    persist.setVaultPath(path.resolve(AppRootPath.path, CONFIG.getVariable('vault_path')));

    // list levels
    app.get('/vault', (req, res) => {
        persist.listLevels()
            .then(r => res.json(r))
            .catch(e => {
                console.error('GET /vault - error');
                console.error(e);
            })
    });

    // loads a level for the map editor
    app.get('/vault/:name.json', (req, res) => {
        const name = req.params.name;
        persist.loadLevel(name).then(r => res.json(r));
    });

    // load a preview thumbnail of a level
    app.get('/vault/:name.jpg', async (req, res) => {
        const name = req.params.name;
        const filename = await persist.getLevelPreview(name);
        res.sendFile(path.resolve(persist.getVaultPath(), filename));
    });

    // get the zipped version of a level
    app.get('/vault/:name.zip', async (req, res) => {
        try {
            const name = req.params.name;
            const data = await persist.loadLevel(name);
            const archive = await LZ.buildZip(name, data);
            res.download(archive.filename);
        } catch (e) {
            await res.json({status: 'error', error: e.message});
        }
    });

    // save level in the vault under a specified name
    app.post('/vault/:name', async (req, res) => {
        try {
            const name = req.params.name;
            const {data} = req.body;
            const r = await persist.saveLevel(name, data);
            await res.json(r)
        } catch (e) {
            await res.json({status: 'error', error: e.message});
        }
    });

    // delete a specified level from the vault
    app.delete('/vault/:name', (req, res) => {
        const name = req.params.name;
        persist.removeLevel(name).then(r => res.json(r));
    });

    // export this level to the game assets
    app.get('/export/:name', async (req, res) => {
        try {
            const name = req.params.name;
            const data = await persist.loadLevel(name);
            await LZ.exportLevel(name, data, {
                textures: CONFIG.getVariable('texture_path'),
                level: CONFIG.getVariable('level_path'),
                game: path.resolve(AppRootPath.path, CONFIG.getVariable('game_path'))
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
    const sExamplePath = path.resolve(O876_RC_ROOT_PATH, 'examples');
    app.use('/examples', express.static(sExamplePath));
    app.get('/examples-list', async (req, res) => {
        // get a list of all example
        const aList = await readdir(sExamplePath);
        return res.json({list: aList});
    });
}


/**
 * inits the web site sub service
 * this is a User Interface to easily acces to all Raycaster components such as :
 * - examples
 * - map editor
 */
function initWebSite() {
    app.use('/', express.static(path.resolve(O876_RC_ROOT_PATH, 'tools/website')));
}


/**
 * inits the dist sub service
 * provides access to all packed scripts inside the DIST folder
 */
function initDist() {
    app.use('/dist', express.static(path.resolve(O876_RC_ROOT_PATH, 'dist')));
}

/**
 * create the game project tree
 */
function initGameProject() {
    const GAME_ACTION_PREFIX = CONFIG.getVariable('game_action_prefix');

    // declare the assets directory as static resources
    app.use(GAME_ACTION_PREFIX + '/assets', express.static(path.resolve(AppRootPath.path, CONFIG.getVariable('game_path'), 'assets')));

    // declare the dist directory as static resources
    app.use(GAME_ACTION_PREFIX + '/dist', express.static(path.resolve(AppRootPath.path, CONFIG.getVariable('game_path'), 'dist')));

    // get a list of published levels
    app.get(GAME_ACTION_PREFIX + '/levels', async (req, res) => {
        try {
            const aPublished = await pm.getPublishedLevels();
            const aVault = await persist.listLevels();
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
        res.sendFile(path.resolve(AppRootPath.path, CONFIG.getVariable('game_path'), 'index.html'));
    });

    pm.run(AppRootPath.path);
}


function run(options) {
    print('---------------------------------');
    print('O876 Raycaster Engine Web Service');
    print('version: ' + process.env.npm_package_version);
    print('Laboralphy');
    print('---------------------------------');
    print(' ');
    if ('port' in options) {
        CONFIG.setVariable('port', options.port);
    }

    if ('vault_path' in options) {
        CONFIG.setVariable('vault_path', options.vault_path);
    }

    if ('game_path' in options) {
        CONFIG.setVariable('game_path', options.game_path);
    }

    if ('game_action_prefix' in options) {
        CONFIG.setVariable('game_action_prefix', options.game_action_prefix);
    }

    initGameProject();
    initFavicon();
    initMapEditor();
    initExamples();
    initDist();
    initWebSite();

    app.listen(CONFIG.getVariable('port'));
    print('base location :', AppRootPath.path);
    print('vault location :', CONFIG.getVariable('vault_path'));
    print('game project location :', CONFIG.getVariable('game_path'));
    print('server port :', CONFIG.getVariable('port'));
    print('action prefix :', CONFIG.getVariable('game_action_prefix'));
    print('website url : http://localhost:' + CONFIG.getVariable('port') + '/');
    print('service is now listening...')
}

module.exports = {
    run
};