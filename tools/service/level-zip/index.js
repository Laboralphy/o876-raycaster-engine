/**
 * Turns level data to a zip package
 */

const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const mkdirp = util.promisify(require('mkdirp'));
const persist = require('../persist');
const path = require('path');
const {generate} = require('../../generate');
const appendImages = require('../append-images');


const writeFile = util.promisify(fs.writeFile);




const RC_FOLDER = 'rc';
const ENG_FOLDER = 'eng';
const ZIP_FOLDER = 'zip';




const JSON_PATH = 'eng';
const TEXTURE_FOLDER = 'textures';
const TEXTURE_PATH = path.join(JSON_PATH, TEXTURE_FOLDER);
const ZIP_PATH = 'zip';

/**
 * Returns the md5 hash of the specified data
 * @param data {string} input data
 * @returns {string} resulting md5
 */
function computeMD5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * turn a base64 image/png into a binary buffer
 * @param imageData {string} base 64 image data
 * @return {Buffer}
 */
function getPNGBuffer(imageData) {
    const sign = "data:image/png;base64,";
    return new Buffer(imageData.substr(sign.length), 'base64');
}

/**
 * out of image content, build the following :
 * - md5 : to get the name
 * - filename : to get the file final location
 * - data : to get a binary buffer
 * @param src {string} base 64 image content
 * @return {{filename: string, data: Buffer, index: string}}
 */
function generateImageEntry(src) {
    const sIndex = computeMD5(src);
    const sFile = path.join(TEXTURE_FOLDER, sIndex + '.png');
    return {
        index: sIndex,
        filename: sFile,
        data: getPNGBuffer(src)
    };
}

/**
 * Create structure to put json and png files
 *
 * vault/{name}
 * vault/{name}/level.json              // map-edit save file
 * vault/{name}/preview.json            // base64 version of the preview thumbnail (map-edit)
 * vault/{name}/rc/                     // rc working directory
 * vault/{name}/rc/eng/                 // rc-engine version of the level - base directory
 * vault/{name}/rc/eng/level.json       // rc-engine json
 * vault/{name}/rc/eng/textures/*.png   // textures referenced by rc-engine level.json
 * vault/{name}/rc/zip/                 // packer working directory
 * vault/{name}/rc/zip/{name}.zip       // zipped version of /rc/eng
 *
 *
 *
 * @param baseDir
 * @returns {Promise<{LEVEL_FOLDER, ZIP_FOLDER}>}
 */
async function createFileStructure(baseDir, name) {
    const LEVEL_PATH = path.resolve(baseDir, name, JSON_PATH);
    const ZIP_PATH = path.resolve(baseDir, name, ZIP_PATH);
    const TEXTURE_PATH = path.resolve(baseDir, name, JSON_PATH, )
    // creates output folder if not already done
    await mkdirp(LEVEL_PATH);
    await mkdirp(TEXTURE_PATH);
    await mkdirp(ZIP_PATH);
}




async function generateZipPackage(baseDir, name, data) {

    // get all tiles
    const aImageEntries = data.tilesets.map(ts => {
        const ie = generateImageEntry(ts.src);
        ts.src = ie.filename;
        return ie;
    });

    const aTextureList = ['flats', 'walls', 'sky'];
    const oTextures = data.level.textures;

    // append all walls, flats and sky textures
    aTextureList.forEach(t => {
        if (t) {
            const ie = generateImageEntry(oTextures[t]);
            aImageEntries.push(ie);
            oTextures[t] = ie.filename;
        }
    });

    // aTexture in an array of imageEntries

    for (let i = 0, l = aImageEntries.length; i < l; ++i) {
        const t = aImageEntries[i];
        await writeFile(path.resolve(baseDir, t.filename), t.data);
    }

    await writeFile(path.resolve(LEVEL_FOLDER, 'level.json'), data);
}

// 1) generate JSON from save file, use the node version of "append-images"
// 2) nous avons un JSON pret à l'emploi pour du raycasting
// 3) nous allons extraire les images base64  dans des fichiers
// 4) il faut préparer la structure des répertoire


module.exports = {
    generateZipPackage
};