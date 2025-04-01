/**
 * Turns level data to a zip package
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const util = require('util');
const generate = require('../generate');
const appendImages = require('../append-images');

const wf = util.promisify(fs.writeFile);

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
    return Buffer.from(imageData.substr(sign.length), 'base64');
}

/**
 * turn a base64 image/jpeg into a binary buffer
 * @param imageData {string} base 64 image data
 * @return {Buffer}
 */
function getJPEGBuffer(imageData) {
    const sign = "data:image/jpeg;base64,";
    return Buffer.from(imageData.substr(sign.length), 'base64');
}

/**
 * out of png image content, build the following :
 * - md5 : to get the name
 * - filename : to get the file final location
 * - data : to get a binary buffer
 * @param src {string} base 64 image content
 * @param sImagePath {string} directory where image goes
 * @return {{filename: string, data: Buffer, index: string}}
 */
function generatePNGImageEntry(src, sImagePath) {
    const sIndex = computeMD5(src);
    const sFile = sIndex + '.png';
    return {
        index: sIndex,
        filename: path.join(sImagePath, sFile),
        data: getPNGBuffer(src)
    };
}

/**
 * out of jpeg image content, build the following :
 * - md5 : to get the name
 * - filename : to get the file final location
 * - data : to get a binary buffer
 * @param src {string} base 64 image content
 * @param sImagePath {string} directory where image goes
 * @return {{filename: string, data: Buffer, index: string}}
 */
function generateJPEGImageEntry(src, sImagePath) {
    const sIndex = computeMD5(src);
    const sFile = sIndex + '.jpg';
    return {
        index: sIndex,
        filename: path.join(sImagePath, sFile),
        data: getJPEGBuffer(src)
    };
}

/**
 * Builds an image Registry out of the specified data
 * This registry contains item with this format :
 * {
 *     index {string} md5 hash of the image content
 *     filename {string} image filename
 *     data {Buffer} image content (pure binary data)
 * }
 * @param data
 * @param sImagePath
 * @return []
 */
function buildImageRegistry(data, sImagePath = '') {
    // get all tiles
    const aImageEntries = data.tilesets.map(ts => {
        const ie = generatePNGImageEntry(ts.src, sImagePath);
        ts.src = ie.filename;
        return ie;
    });

    const aTextureList = ['flats', 'walls', 'sky'];
    const oTextures = data.level.textures;

    // append all walls, flats and sky textures
    aTextureList
        .filter(t => typeof oTextures[t] === 'string' && oTextures[t].length > 0)
        .forEach(t => {
            const ie = generatePNGImageEntry(oTextures[t], sImagePath);
            aImageEntries.push(ie);
            oTextures[t] = ie.filename;
        });
    if (data.preview.length > 0) {
        const iePreview = generateJPEGImageEntry(data.preview, sImagePath);
        aImageEntries.push(iePreview);
        data.preview = iePreview.filename;
    }
    return aImageEntries;
}

// 1) generate JSON from save file, use the node version of "append-images"
// 2) nous avons un JSON pret à l'emploi pour du raycasting
// 3) nous allons extraire les images base64  dans des fichiers
// 4) il faut préparer la structure des répertoire

/**
 * Export a level from Map Editor to the Game Project Directory
 * @param name {string} name of the project to be exported
 * @param dataME {*} data content
 * @param textures {string} directory where texture goes
 * @param level {string} directory where level go
 * @param game {string} game base directory
 * @returns {Promise}
 */
async function exportLevel(name, dataME, {textures, level, game}) {
    const dataENG = await generate(dataME, appendImages);
    const aImageEntries = buildImageRegistry(dataENG, textures);

    // saving all textures
    const promWf= aImageEntries.map(ie => wf(path.resolve(game, ie.filename), ie.data));
    promWf.push(wf(path.resolve(game, level, name + '.json'), JSON.stringify(dataENG, null, '  ')));
    return Promise.all(promWf);
}

module.exports = {
    exportLevel
};
