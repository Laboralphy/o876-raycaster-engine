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
 * inits the map editor sub-service
 * and the map editor persistance sub-service
 */
function initMapEditor() {
    app.use(express.json({limit: '48mb'})); // for parsing application/json
    app.use('/mapedit', express.static(getProjectFQN('tools', 'mapedit')));
    persist.setVaultPath(CONFIG.getVariable('vault_path'));

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
        res.sendFile(getProjectFQN(filename));
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


/**
 * inits the web site sub service
 * this is a User Interface to easily acces to all Raycaster components such as :
 * - examples
 * - map editor
 */
function initWebSite() {
    app.use('/', express.static(getProjectFQN('tools', 'website')));
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
    const GAME_ACTION_PREFIX = '/' + CONFIG.getVariable('game_action_prefix');

    // declare the assets directory as static resources
    app.use(GAME_ACTION_PREFIX + '/assets', express.static(getProjectFQN(CONFIG.getVariable('game_path'), 'assets')));

    // declare the dist directory as static resources
    app.use(GAME_ACTION_PREFIX + '/dist', express.static(getProjectFQN(CONFIG.getVariable('game_path'), 'dist')));

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
    gpoe('game_action_prefix', 'game_action_prefix', 'GAME_ACTION_PREFIX', 'game');

    initGameProject();
    initFavicon();
    initMapEditor();
    initExamples();
    initDist();
    initWebSite();

    app.listen(CONFIG.getVariable('port'));
    print('base location :', options.base_path);
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