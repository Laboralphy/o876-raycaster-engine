/**
 * Turns level data to a zip package
 */
const crypto = require('crypto');
const fs = require('fs');
const persist = require('../persist');
const path = require('path');
const mkdirp = require('mkdirp');
const generate = require('../../generate');
const appendImages = require('../append-images');
const archiver = require('archiver');

const PNG_FOLDER = 'textures';  // folder containing all png

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
    const sFile = path.join('.', PNG_FOLDER, sIndex + '.png');
    return {
        index: sIndex,
        filename: sFile,
        data: getPNGBuffer(src)
    };
}

/**
 * creates an archive and its content, out of a level-save-file
 * @param name {string} name of the archive
 * @param data {*} data loaded from save file (map edit)
 * @param zipPath {string} path where to save the archive
 * @returns {Promise<{filename, bytes}>} info about the archive file
 */
async function generateZipPackage(name, data, zipPath) {
    return new Promise((resolve, reject) => {
        try {
            // ZIP CREATION
            const filename = path.resolve(zipPath, name + '.zip');
            const output = fs.createWriteStream(filename);
            const archive = archiver('zip', {
                zlib: {level: 9}
            });

            // good practice to catch this error explicitly
            archive.on('error', function (err) {
                reject(err);
            });

            // pipe archive data to the file
            archive.pipe(output);

            // listen for all archive data to be written
            // 'close' event is fired only when a file descriptor is involved
            output.on('close', function () {
                resolve({
                    filename,
                    bytes: archive.pointer()
                });
            });

            // get all tiles
            const aImageEntries = data.tilesets.map(ts => {
                const ie = generateImageEntry(ts.src);
                ts.src = ie.filename;
                return ie;
            });

            const aTextureList = ['flats', 'walls', 'sky'];
            const oTextures = data.level.textures;

            // append all walls, flats and sky textures
            aTextureList
                .filter(t => typeof oTextures[t] === 'string' && oTextures[t].length > 0)
                .forEach(t => {
                    const ie = generateImageEntry(oTextures[t]);
                    aImageEntries.push(ie);
                    oTextures[t] = ie.filename;
                });

            // aImageEntries in an array of imageEntries
            for (let i = 0, l = aImageEntries.length; i < l; ++i) {
                const t = aImageEntries[i];
                archive.append(t.data, { name: t.filename });
            }

            archive.append(JSON.stringify(data, null, '  '), { name: 'level.json'});
            archive.finalize();
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

// 1) generate JSON from save file, use the node version of "append-images"
// 2) nous avons un JSON pret à l'emploi pour du raycasting
// 3) nous allons extraire les images base64  dans des fichiers
// 4) il faut préparer la structure des répertoire


/**
 * Zips a project
 * @param name {string} name of the project to be zipped
 * @param dataME {*} data content
 * @returns {Promise<{filename, bytes}>} will be resolve when the archive is fully built
 */
async function buildZip(name, dataME) {
    const ZIP_PATH = path.resolve(persist.getVaultPath(), name, 'zip');
    await mkdirp(ZIP_PATH);
    const dataENG = await generate(dataME, appendImages);
    return generateZipPackage(name, dataENG, ZIP_PATH);
}

module.exports = buildZip;
