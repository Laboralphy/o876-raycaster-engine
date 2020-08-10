const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');
const persist = require('../../persist');
const pm = require('../../project-mgr');

const {getProjectFQN} = require('../../get-project-fqn');
const {getUserAuth} = require('../../get-user-auth');

/**
 * Ce service doit juste permettre au site web de fonctionner
 * C'est un site web classique avec un point d'entrée index.html
 * @type {Service}
 * @extends {ServiceAbstract}
 */
module.exports = class Service extends ServiceAbstract {

    /**
     * STATIC /game/assets            static route to a game assets (the game is defined in the .env file)
     * STATIC /game/dist              static route to the dist folder of a game
     * GET /game/levels               a list of levels stored in the game "levels" folder
     * DELETE /game/level/:idlevel    remove a level from the game (unpublish the level) the level is stored into the local vault
     * GET /game
     * GET /game/index.html     the game entry point
     *
     * @param application
     * @param express
     */
    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        const GAME_ACTION_PREFIX = '/game';

        // declare the assets directory as static resources
        app.use(GAME_ACTION_PREFIX + '/assets', express.static(getProjectFQN(CONFIG.getVariable('game_path'), 'assets')));

        // declare the dist directory as static resources
        app.use(GAME_ACTION_PREFIX + '/dist', express.static(getProjectFQN(CONFIG.getVariable('game_path'), 'dist')));

        // get a list of published levels
        app.get(GAME_ACTION_PREFIX + '/levels', async (req, res) => {
            try {
                const oUser = getUserAuth(req);
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
        // only available for local developement
        if (CONFIG.getVariable('local_dev')) {
            app.delete(GAME_ACTION_PREFIX + '/level/:name', (req, res) => {
                pm
                    .unpublishLevel(req.params.name)
                    .then(() => res.json({status: 'done'}))
                    .catch(e => res.json({status: 'error', error: e.message}));
            });
        }

        // redirection -> launch the game
        app.get(GAME_ACTION_PREFIX + '/', (req, res) => {
            res.redirect(301, GAME_ACTION_PREFIX + '/index.html');
        });

        // launch the game
        app.get(GAME_ACTION_PREFIX + '/index.html', (req, res) => {
            res.sendFile(getProjectFQN(CONFIG.getVariable('game_path'), 'index.html'));
        });

        // will check the existance of the game directory and create it if necessery
        pm.run(CONFIG.getVariable('base_path'));
    }
};

