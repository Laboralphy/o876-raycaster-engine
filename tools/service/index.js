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

const app = express();
const ROOT = path.resolve(__dirname, '../../');


// the map editor sub-service
// and the map editor persistance sub-service
function initMapEditor() {
    app.use(express.json()) // for parsing application/json
    app.use('/mapedit', express.static(path.resolve(ROOT, 'tools/mapedit')));
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


// the examples sub-service
// provide static access to all packed compiled by webpack
function initExamples() {
    app.use('/examples', express.static(path.resolve(ROOT, 'examples')));
}


// the dist sub-services
// provides access to all packed scripts inside the DIST folder
function initDist() {
    app.use('/dist', express.static(path.resolve(ROOT, 'dist')));
}

initMapEditor();
initExamples();
initDist();

app.listen(CONFIG.port);
console.log('listening port', CONFIG.port);