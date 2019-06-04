/**
 * This service provides :
 * 1) access to the map editor and its persistance service
 * 2) access to examples
 * 3) access to scripts built in dist folder
 */
const CONFIG = require('./config');
const express = require('express');
const path = require('path');
const persist = require('./persist');
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
    app.use(express.json({limit: '50mb'})); // for parsing application/json
    app.use('/mapedit', express.static(path.resolve(ROOT, 'tools/mapedit')));
    print('[url] http://localhost:8080/mapedit - invokes the map editor');
    persist.setVaultPath(CONFIG.vault_folder);
    print('vault path is currently set at', persist.getVaultPath());
    // service/?action=save
    // service/?action=load
    // service/?action=list
    app. get('/vault', (req, res) => {
        const q = req.query;
        const action = 'action' in q ? q.action : '';
        const name = 'name' in q ? q.name : '';
        switch (action) {
            case 'list':
                persist.ls().then(r => res.json(r));
                break;

            case 'load':
                persist.load(name).then(r => res.json(r));
                break;
        }
    });
    app.post('/vault', (req, res) => {
        const q = req.query;
        const {data} = req.body;
        const action = 'action' in q ? q.action : '';
        const name = 'name' in q ? q.name : '';
        if (action === 'save') {
            persist.save(name, data)
                .then(r => res.json(r))
                .catch(err => {
                    console.error(err);
                    res.json({status: 'error', error: err.message})
                });
        }
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
    print('[url] http://localhost:8080/examples - is where all examples and demos are located');
}


/**
 * inits the web site sub service
 * this is a User Interface to easily acces to all Raycaster components such as :
 * - examples
 * - map editor
 */
function initWebSite() {
    app.use('/website', express.static(path.resolve(ROOT, 'tools/website')));
    print('[url] http://localhost:8080/ - website location');
}


/**
 * inits the dist sub service
 * provides access to all packed scripts inside the DIST folder
 */
function initDist() {
    app.use('/dist', express.static(path.resolve(ROOT, 'dist')));
    print('[url] http://localhost:8080/dist - is where all packed scripts are located');
}

initMapEditor();
initExamples();
initDist();
initWebSite();

app.listen(CONFIG.port);
print('listening port', CONFIG.port);