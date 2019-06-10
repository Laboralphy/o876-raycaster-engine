const fs = require('fs');
const {PNG} = require('pngjs');
let streams = require('stream');

const PNG_SIGN =  'data:image/png;base64,';


/**
 * Write a png file on disk
 * @param file {string} output filename
 * @param png {PNG} png to be save
 * @return {Promise<PNG>}
 */
function savePNG(file, png) {
    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(file);
        stream.on('close', event => {
            resolve(png);
        });
        png.pack().pipe(stream);
    });
}

/**
 * Turns a buffer into a node js readable stream
 * @param buffer {Buffer} any buffer
 * @return {module:stream.internal.Duplex|Stream}
 */
function bufferToStream(buffer) {
    const Duplex = streams.Duplex;
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

/**
 * creates an empty PNG with a given size
 * @param width {number} image with
 * @param height
 * @return {PNG}
 */
function createPNG(width, height) {
    return new PNG({width, height});
}

/**
 * turn a base64 image/png into a binary buffer
 * @param imageData {string} base 64 image data
 * @return {Buffer}
 */
function getPNGBuffer(imageData) {
    return Buffer.from(imageData.substr(PNG_SIGN.length), 'base64');
}

/**
 * Decode a PNG binary stream into a PNG instance
 * @param stream {Stream}
 * @return {Promise<PNG>}
 */
function loadPNGFromStream(stream) {
    return new Promise((resolve, reject) => {
        const png = new PNG();
        stream.pipe(png)
            .on('parsed', () => resolve(png))
            .on('error', err => reject(err));
    });
}

/**
 * Loads a png file and returns a pngjs instance of that image
 * @param file {string} filename
 * @return {Promise<PNG>}
 */
function loadPNGFromFile(file) {
    return loadPNGFromStream(fs.createReadStream(file));
}

/**
 * loads a png from a buffer ; the buffer must contain binary data of a png file
 * if you work with <img/> and data-url you may want ot check getPNGBuffer()
 * which converts data-url to Buffer
 * @param buffer {Buffer}
 * @return {Promise<PNG>}
 */
function loadPNGFromBuffer(buffer) {
    return loadPNGFromStream(bufferToStream(buffer));
}

/**
 * loads a png from a string as if ti were loaded by a file_get_contents function;
 * @param s {String}
 * @return {Promise<PNG>}
 */
function loadPNGFromBase64(s) {
    return loadPNGFromBuffer(getPNGBuffer(s));
}

/**
 * Renders a PNG into a base64 encoded string
 * @param png {PNG} instance of PNG
 * @returns {string} a base 64 string
 */
function pngToBase64(png) {
    return PNG_SIGN + PNG.sync.write(png).toString('base64');
}

async function appendImages(tilesets, iStart, count) {
    // déterminer la liste des frames à recombiner
    const aAllTiles = [];
    for (let i = 0; i < count; ++i) {
        aAllTiles.push(tilesets[iStart + i].content);
    }
    const proms = aAllTiles.map(t => loadPNGFromBase64(t));
    const aCanvases = await Promise.all(proms);
    if (aCanvases.length === 0) {
        throw new Error('no tile defined');
    }
    const w = aCanvases[0].width;
    const h = aCanvases[0].height;
    const pngOutput = createPNG(w * count, h);
    for (let i = 0; i < count; ++i) {
        aCanvases[i].bitblt(pngOutput, 0, 0, w, h, i * w, 0);
    }
    return {
        src: pngToBase64(pngOutput),
        width: w | 0,
        height: h | 0
    };
}

module.exports = appendImages;