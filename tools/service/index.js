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
const persist = require('./persist');
const buildZip = require('./level-zip');
const util = require('util');
const fs = require('fs');
const AppRootPath = require('app-root-path');
const pm = require('./project-mgr');

const app = express();
const O876_RC_ROOT_PATH = path.resolve(__dirname, '../../');
const CONFIG = {
    port: 8080,
    vault_path: path.resolve(AppRootPath.path, 'vault'),
    game_path: path.resolve(AppRootPath.path, 'game')
};

const readdir = util.promisify(fs.readdir);

function print(...args) {
    console.log(...args);
}

/**
 * inits the map editor sub-service
 * and the map editor persistance sub-service
 */
function initMapEditor() {
    app.use(express.json({limit: '48mb'})); // for parsing application/json
    app.use('/mapedit', express.static(path.resolve(O876_RC_ROOT_PATH, 'tools/mapedit')));
    persist.setVaultPath(CONFIG.vault_path);

    // list levels
    app.get('/vault', (req, res) => {
        persist.ls()
            .then(r => res.json(r))
            .catch(e => {
                console.error('GET /vault - error');
                console.error(e);
            })
    });

    // load level

    app.get('/vault/:name.json', (req, res) => {
        const name = req.params.name;
        persist.load(name).then(r => res.json(r));
    });

    app.get('/vault/:name.zip', async (req, res) => {
        try {
            const name = req.params.name;
            const data = await persist.load(name);
            const archive = await buildZip(name, data);
            res.download(archive.filename);
        } catch (e) {
            res.json({status: 'error', error: e.message});
        }
    });

    // save level
    app.post('/vault/:name', async (req, res) => {
        try {
            const name = req.params.name;
            const {data} = req.body;
            const r = await persist.save(name, data);
            res.json(r)
        } catch (e) {
            res.json({status: 'error', error: e.message});
        }
    });

    // delete level
    app.delete('/vault/:name', (req, res) => {
        const name = req.params.name;
        persist.rm(name).then(r => res.json(r));
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
        res.json({list: aList});
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
        CONFIG.port = options.port;
    }

    if ('vault_path' in options) {
        CONFIG.vault_path = options.vault_path;
    }

    initMapEditor();
    initExamples();
    initDist();
    initWebSite();
    initGameProject();

    app.listen(CONFIG.port);
    print('vault location :', CONFIG.vault_path);
    print('game project location :', path.join(AppRootPath.path, 'game'));
    print('server port :', CONFIG.port);
    print('website url : http://localhost:' + CONFIG.port + '/');
    print('service is now listening...')
}

module.exports = {
    run
};