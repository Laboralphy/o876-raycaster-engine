

const CONFIG = {
    // not configurable by command line
    texture_path: 'assets/textures',
    level_path: 'assets/levels',
    data_path: 'assets/data',
    game_action_prefix: 'game', // this value must be identical with your Engine configuration

    // configurable by .env
    port: parseInt(process.env.SERVER_PORT || 8080), // server listening port
    address: process.env.SERVER_ADDRESS,
    vault_path: process.env.VAULT_PATH || '.',    // the folder where all map editor levels are located
    game_path: process.env.GAME_PATH || '.',  // the game project folder
    base_path: process.cwd(), // the base path (where the script is run from)
    session_path: process.env.SESSION_PATH || '.',
    news_path: process.env.NEWS_PATH || '',
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