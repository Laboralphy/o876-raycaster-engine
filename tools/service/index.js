/**
 * This service provides :
 * 1) access to the map editor and its persistance service
 * 2) access to examples
 * 3) access to scripts built in dist folder
 */
const CONFIG = require('./config');
const express = require('express');
const path = require('path');
const os = require('os');
const persist = require('./persist');
const buildZip = require('./level-zip');
const util = require('util');
const fs = require('fs');

const app = express();
const ROOT = path.resolve(__dirname, '../../');

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
    app.use('/mapedit', express.static(path.resolve(ROOT, 'tools/mapedit')));
    persist.setVaultPath(CONFIG.vault_path);
    print('vault path : ', persist.getVaultPath());

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
    const sExamplePath = path.resolve(ROOT, 'examples');
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
    app.use('/', express.static(path.resolve(ROOT, 'tools/website')));
    print('website url : http://localhost:' + CONFIG.port + '/');
}


/**
 * inits the dist sub service
 * provides access to all packed scripts inside the DIST folder
 */
function initDist() {
    app.use('/dist', express.static(path.resolve(ROOT, 'dist')));
}


function run(options) {
    if ('port' in options) {
        CONFIG.port = options.port;
    }

    if ('vault_path' in options) {
        if (options.vault_path === '~' || options.vault_path.startsWith('~/')) {
            options.vault_path = path.resolve(os.homedir(), options.vault_path.substr(2));
        }
        CONFIG.vault_path = options.vault_path;
    }

    initMapEditor();
    initExamples();
    initDist();
    initWebSite();

    app.listen(CONFIG.port);
    print('game path : ', CONFIG.game_path);
    print('server port : ', CONFIG.port);
}

module.exports = {
    run
};