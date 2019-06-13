const util = require('util');
const path = require('path');
const fs = require('fs');

// promisification
const mkdirp = util.promisify(require('mkdirp'));
const stat = util.promisify(fs.stat);

let BASE_DIR = '.';
const TEMPLATE_DIR = path.resolve(__dirname, 'templates');

let GAME_ROOT_DIR = 'game';
let GAME_SRC_DIR = path.join(GAME_ROOT_DIR, 'src');
let GAME_ASSETS_DIR = path.join(GAME_ROOT_DIR, 'assets');
let GAME_DATA_DIR = path.join(GAME_ROOT_DIR, 'data');
let GAME_DIST_DIR = path.join(GAME_ROOT_DIR, 'dist');
let VAULT_DIR = 'vault';


/**
 * Sets a new value for the base directory where the game project will be hosted
 * @param sDir {string}
 */
function setBaseDirectory(sDir) {
    BASE_DIR = sDir;
    GAME_ROOT_DIR = 'game';
    GAME_SRC_DIR = path.join(GAME_ROOT_DIR, 'src');
    GAME_ASSETS_DIR = path.join(GAME_ROOT_DIR, 'assets');
    GAME_DATA_DIR = path.join(GAME_ROOT_DIR, 'data');
    GAME_DIST_DIR = path.join(GAME_ROOT_DIR, 'dist');
    VAULT_DIR = 'vault';
}


const PROJECT_TREE = [

    {
        path: path.join(GAME_ROOT_DIR, 'index.html'),
        template: 'index.html'
    },

    {
        path: path.join(GAME_ROOT_DIR, 'webpack.config.js'),
        template: 'webpack.config.js'
    },

    {
        path: path.join(VAULT_DIR, 'vault_readme.txt'),
        template: 'vault_readme.txt'
    },

    {
        path: path.join(GAME_DIST_DIR, 'dist_readme.txt'),
        template: 'dist_readme.txt'
    },

    {
        path: path.join(GAME_SRC_DIR, 'index.js'),
        template: 'index.js'
    },

    {
        path: path.join(GAME_ASSETS_DIR, 'levels', 'assets_levels_readme.txt'),
        template: 'assets_levels_readme.txt'
    },

    {
        path: path.join(GAME_ASSETS_DIR, 'textures', 'assets_textures_readme.txt'),
        template: 'assets_textures_readme.txt'
    },

    {
        path: path.join(GAME_DATA_DIR, 'tilesets.json'),
        template: 'tilesets.json'
    },

    {
        path: path.join(GAME_DATA_DIR, 'blueprints.json'),
        template: 'blueprints.json'
    },

    {
        path: path.join(GAME_ASSETS_DIR, 'styles', 'base.css'),
        template: 'base.css'
    }

];

/**
 * if the file exists this promise resolves true, else resolves false
 * @param what {string} file name
 * @return {Promise<boolean>}
 */
function exists(what) {
    return new Promise(resolve => {
        stat(what)
            .then(() => resolve(true))
            .catch(err => resolve(false));
    });
}

/**
 * Copy one file content to another file, target and source file names must be specify.
 * The destination folder must exists
 * @param from {string} source file name
 * @param to {string} target file name. File name must be specified, destination folder is not enough
 * @return {Promise<any>}
 */
function copy(from, to) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(to);
        output.on('close', function() {
            resolve(true);
        });
        output.on('error', function(err) {
            reject(err);
        });
        fs.createReadStream(from).pipe(output);
    });
}

/**
 * Run a template element.
 * @param oItem {*}
 * @return {Promise<void>}
 */
async function runTemplateItem(oItem) {
    const sTarget = path.resolve(BASE_DIR, oItem.path);
    const sTargetDir = path.dirname(sTarget);
    if (!await exists(sTarget)) {
        if (!await exists(sTargetDir)) {
            await mkdirp(sTargetDir);
        }
        await copy(path.resolve(TEMPLATE_DIR, oItem.template), path.resolve(BASE_DIR, oItem.path));
    }
}

/**
 * run the entire process
 * @param sBaseDir {string} the base directory is the directory where everything will be created
 * @return {Promise<void>}
 */
async function run(sBaseDir) {
    setBaseDirectory(sBaseDir);
    for (let i = 0, l = PROJECT_TREE.length; i < l; ++i) {
        await runTemplateItem(PROJECT_TREE[i]);
    }
}

module.exports = {
    run
};
