const ServiceAbstract = require('@laboralphy/ws-service/abstract');
const CONFIG = require('../../config');
const persist = require('../../persist');
const LZ = require('../../level-zip');

const {getProjectFQN} = require('../../get-project-fqn');
const {getUserAuth} = require('../../get-user-auth');

/**
 * STATIC /mapedit              the static route to the mapedit folder
 * GET /vault                   list of all published levels in the game
 * GET /vault/:idlevel.json     a json version of the specified level
 * GET /vault/:idlevel.jpg      the specified level preview image
 * GET /vault/:idlevel.zip      a zipped version of the specified level with all its assets
 * POST /vault/:idlevel         modify the level (a new json must be provided (variable : "data")
 * DELETE /vault/:idlevel       delete a level from the vault
 * GET /export/:idlevel         publish a level
 *
 * all the /vault actions aim a different level whether it's local_dev time or online time
 * when local_dev : /vault -> /vault/local/levels
 * when online : /vault -> /vault/{user}/levels
 *
 * @type {Service}
 * @extends {ServiceAbstract}
 */
module.exports = class Service extends ServiceAbstract {

    registerRoutes(application, express) {
        super.registerRoutes(application, express);
        const app = application;
        app.use(express.json({limit: '48mb'})); // for parsing application/json
        app.use('/mapedit', express.static(getProjectFQN('apps/mapedit')));
        persist.setVaultPath(CONFIG.getVariable('vault_path'));

        // list levels
        app.get('/vault', (req, res) => {
            const oUser = getUserAuth(req);
            persist.listLevels(oUser.id)
                .then(r => res.json(r))
                .catch(e => {
                    console.error('GET /vault - error');
                    console.error(e);
                });
        });

        // loads a level for the map editor
        app.get('/vault/:name.json', (req, res) => {
            const oUser = getUserAuth(req);
            const name = req.params.name;
            persist.loadLevel(oUser.id, name).then(r => res.json(r));
        });

        // load a preview thumbnail of a level
        app.get('/vault/:name.jpg', async (req, res) => {
            const oUser = getUserAuth(req);
            const name = req.params.name;
            const filename = await persist.getLevelPreview(oUser.id, name);
            res.sendFile(getProjectFQN(filename));
        });

        // get the zipped version of a level
        app.get('/vault/:name.zip', async (req, res) => {
            try {
                const oUser = getUserAuth(req);
                const name = req.params.name;
                const data = await persist.loadLevel(oUser.id, name);
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
                const r = await persist.saveLevel(oUser.id, name, data);
                await res.json(r)
            } catch (e) {
                await res.json({status: 'error', error: e.message});
            }
        });

        // delete a specified level from the vault
        app.delete('/vault/:name', (req, res) => {
            const oUser = getUserAuth(req);
            const name = req.params.name;
            persist.removeLevel(oUser.id, name).then(r => res.json(r));
        });

        // we keep export functionnalities only for local development
        if (CONFIG.getVariable('local_dev')) {
            // export this level to the game assets
            // only local work maybe exported
            // not user-based (online)
            app.get('/export/:name', async (req, res) => {
                try {
                    const oUser = getUserAuth(req);
                    const name = req.params.name;
                    const data = await persist.loadLevel(oUser.id, name);
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
    }
}