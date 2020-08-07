require('dotenv').config({ path: './.env' });

const WSService = require('@laboralphy/ws-service');
const WebSite = require('./services/website');
const MapEdit = require('./services/mapedit');
const Passport = require('./services/passport');
const GameProject = require('./services/game-project');
const Examples = require('./services/examples');
const News = require('./services/news');

const CONFIG = require('./config');

function main() {
    console.log('O876 Raycaster Engine Web Service');
    console.log('version: ' + process.env.npm_package_version);
    console.log('Laboralphy');
    console.log(' ');

    console.group('paths');
    console.log('base :', CONFIG.getVariable('base_path'));
    console.log('game :', CONFIG.getVariable('game_path'));
    console.log('vault :', CONFIG.getVariable('vault_path'));
    console.log('sessions :', CONFIG.getVariable('session_path'));
    console.groupEnd('paths');

    console.group('server');
    console.log('port :', CONFIG.getVariable('port'));
    console.log('context :', CONFIG.getVariable('local_dev') ? 'local development' : 'online');
    console.log('server local url :', 'http://localhost:' + CONFIG.getVariable('port'));
    console.groupEnd('server');

    // micro-services

    const wss = new WSService();

    wss.service(new Passport());
    wss.service(new WebSite());
    wss.service(new MapEdit());
    wss.service(new GameProject());
    wss.service(new Examples());
    wss.service(new News());

    wss.listen(CONFIG.getVariable('port'));
    console.log('now listening...');
}

main();