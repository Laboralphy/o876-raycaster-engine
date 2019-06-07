/**
 * Turns level data to a zip package
 */

const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const mkdirp = util.promisify(require('mkdirp'));
const persist = require('./persist');
const path = require('path');
const appendImages = require('./append-images');


const writeFile = util.promisify(fs.writeFile);


const JSON_PATH = 'eng-100';
const TEXTURE_FOLDER = 'textures';
const TEXTURE_PATH = path.join(JSON_PATH, TEXTURE_FOLDER);
const ZIP_PATH = 'pack';

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

async function generateZipPackage(baseDir, name, data) {

    // get all tiles
    const aTextures = data.tilesets.map(ts => {
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
            aTextures.push(ie);
            oTextures[t] = ie.filename;
        }
    });

    const LEVEL_FOLDER = path.resolve(baseDir, name, JSON_PATH);
    const ZIP_FOLDER = path.resolve(baseDir, name, ZIP_PATH);

    // creates output folder if not already done
    await mkdirp(LEVEL_FOLDER);
    await mkdirp(ZIP_FOLDER);

    for (let i = 0, l = aTextures.length; i < l; ++i) {
        const t = aTextures[i];
        await writeFile(path.resolve(baseDir, t.filename), t.data);
    }

    await writeFile(path.resolve(LEVEL_FOLDER, 'level.json'), data);
}


module.exports = {
    generateZipPackage
};