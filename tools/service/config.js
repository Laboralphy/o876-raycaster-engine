const CONFIG = {
    // not configurable by command line
    texture_path: 'assets/textures',
    level_path: 'assets/levels',
    data_path: 'assets/data',

    // configurable at launch by command line
    game_action_prefix: '/game', // this value must be identical with your Engine configuration
    port: 8080, // server listening port
    vault_path: 'vault',    // the folder where all map editor levels are located
    game_path: 'game',  // the game project folder

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