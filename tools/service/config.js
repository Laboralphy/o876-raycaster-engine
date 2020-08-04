const CONFIG = {
    // not configurable by command line
    texture_path: 'assets/textures',
    level_path: 'assets/levels',
    data_path: 'assets/data',

    // configurable at launch by command line
    game_action_prefix: process.env.GAME_ACTION_PREFIX || 'game', // this value must be identical with your Engine configuration
    port: parseInt(process.env.SERVER_PORT || 8080), // server listening port
    vault_path: '',    // the folder where all map editor levels are located
    game_path: '',  // the game project folder
    base_path: '', // the base path (where the script is run from)
    local_dev: !!parseInt(process.env.LOCAL_DEV || 0) // if 0 then the server is set up as an online service, else it is set up for local development.
};

function getVariable(s) {
    if (s in CONFIG) {
        return CONFIG[s];
    } else {
        throw new Error('This config variable is unknown : ' + s);
    }
}

function setVariable(s, v) {
    CONFIG[s] = v;
}



module.exports = {
    getVariable, setVariable
};