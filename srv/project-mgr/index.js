const util = require('util');
const path = require('path');
const fs = require('fs');
const CONFIG = require('../config');

// promisification
const mkdirp = util.promisify(require('mkdirp'));
const stat = util.promisify(fs.stat);
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

const TEMPLATE_DIR = path.resolve(__dirname, 'templates');

let GAME_ROOT_DIR = CONFIG.getVariable('game_path');
let GAME_SRC_DIR = path.join(GAME_ROOT_DIR, 'src');
let GAME_ASSETS_DIR = path.join(GAME_ROOT_DIR, 'assets');
let GAME_DIST_DIR = path.join(GAME_ROOT_DIR, 'dist');
let GAME_DATA_DIR = path.join(GAME_ROOT_DIR, CONFIG.getVariable('data_path'));
let GAME_TEXTURES_DIR = path.join(GAME_ROOT_DIR, CONFIG.getVariable('texture_path'));
let GAME_LEVELS_DIR = path.join(GAME_ROOT_DIR, CONFIG.getVariable('level_path'));
let VAULT_DIR = CONFIG.getVariable('vault_path');
const JSON_EXT = '.json';


/**
 * Sets a new value for the base directory where the game project will be hosted
 */
function setBaseDirectory() {
    GAME_ROOT_DIR = CONFIG.getVariable('game_path');
    GAME_SRC_DIR = path.join(GAME_ROOT_DIR, 'src');
    GAME_ASSETS_DIR = path.join(GAME_ROOT_DIR, 'assets');
    GAME_DIST_DIR = path.join(GAME_ROOT_DIR, 'dist');
    GAME_DATA_DIR = path.join(GAME_ROOT_DIR, CONFIG.getVariable('data_path'));
    GAME_TEXTURES_DIR = path.join(GAME_ROOT_DIR, CONFIG.getVariable('texture_path'));
    GAME_LEVELS_DIR = path.join(GAME_ROOT_DIR, CONFIG.getVariable('level_path'));
    VAULT_DIR = CONFIG.getVariable('vault_path');
}


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

function _getLevelReferencedTextures(data) {
    return ([
        data.level.textures.flats,
        data.level.textures.walls,
        data.level.textures.sky,
        data.preview
    ])
        .concat(data.tilesets.map(ts => ts.src))
        .filter(t => !!t && t.length > 0)
        .map(t => path.basename(t))
        .filter((x, i, a) => a.indexOf(x) === i);
}


async function getUnusedTextures() {
    const p = path.resolve(GAME_TEXTURES_DIR);
    let aTextures = await readDir(p);
    const aFiles = await getPublishedLevels();
    let aFoundTextures = [];
    for (let i = 0, l = aFiles.length; i < l; ++i) {
        const sFileName = path.resolve(GAME_LEVELS_DIR, aFiles[i].name + '.json');
        const content = await readFile(sFileName);
        const data = JSON.parse(content.toString());
        const aLocalTextures = _getLevelReferencedTextures(data);
        aFoundTextures = aFoundTextures.concat(aLocalTextures);
    }
    const aUnused = aTextures.filter(t => aFoundTextures.indexOf(t) < 0);
    return aUnused.filter(t => ['.png', '.jpg'].includes(path.extname(t)));
}

async function removeUnusedTextures() {
    const aRemovees = await getUnusedTextures();
    const aProms = aRemovees.map(t => unlink(path.resolve(GAME_TEXTURES_DIR, t)));
    return Promise.all(aProms);
}



/**
 * Returns a list of published levels
 * @returns []
 */
async function getPublishedLevels() {
    const p = path.resolve(GAME_LEVELS_DIR);
    const aFiles = await readDir(p, {
        withFileTypes: true
    });
    const aLevels = [];
    for (let i = 0, l = aFiles.length; i < l; ++i) {
        const f = aFiles[i];
        if (f.isFile() && f.name.endsWith(JSON_EXT)) {
            const sFileName = path.resolve(GAME_LEVELS_DIR, f.name);
            const content = await readFile(sFileName);
            const data = JSON.parse(content);
            const name = path.basename(f.name, JSON_EXT);
            const exported = true;
            const preview = 'game/' + data.preview;
            const st = await stat(sFileName);
            const date = Math.floor(st.mtimeMs);
            aLevels.push({
                name, preview, exported, date
            });
        }
    }
    return aLevels;
}

async function unpublishLevel(name) {
    const sFileName = path.resolve(GAME_LEVELS_DIR, name + JSON_EXT);
    if (await exists(sFileName)) {
        await unlink(sFileName);
        await removeUnusedTextures();
    } else {
        console.warn('unpublish', name, 'failed : file does not exist');
    }
}


/**
 * Run a template element.
 * @param oItem {*}
 * @return {Promise<boolean>}
 */
async function runTemplateItem(oItem) {
    const sTarget = path.resolve(oItem.path);
    const sTargetDir = path.dirname(sTarget);
    if (!await exists(sTarget)) {
        if (!await exists(sTargetDir)) {
            await mkdirp(sTargetDir);
        }
        await copy(path.resolve(TEMPLATE_DIR, oItem.template), path.resolve(oItem.path));
        return true;
    } else {
        return false;
    }
}

/**
 * run the entire process
 * @return {Promise<void>}
 */
async function run() {
    setBaseDirectory();
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
            path: path.join(GAME_SRC_DIR, 'Game.js'),
            template: 'Game.js'
        },

        {
            path: path.join(GAME_SRC_DIR, 'index.js'),
            template: 'index.js'
        },

        {
            path: path.join(GAME_LEVELS_DIR, 'assets_levels_readme.txt'),
            template: 'assets_levels_readme.txt'
        },

        {
            path: path.join(GAME_TEXTURES_DIR, 'assets_textures_readme.txt'),
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
        },

        {
            path: path.join(GAME_SRC_DIR, 'config', 'index.js'),
            template: 'config.js'
        }
    ];
    let bCreated = false;
    for (let i = 0, l = PROJECT_TREE.length; i < l; ++i) {
        bCreated |= await runTemplateItem(PROJECT_TREE[i]);
    }
    if (bCreated) {
        console.log('project creation :', CONFIG.getVariable('game_path'));
    }
}

module.exports = {
    run,
    getPublishedLevels,
    unpublishLevel,
    setBaseDirectory
};
