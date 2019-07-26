const CONFIG = {
    port: 8080,
    vault_path: 'vault',
    game_path: 'game',
    texture_path: 'assets/textures',
    level_path: 'assets/levels',
    data_path: 'assets/data'
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