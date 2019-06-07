const fs = require('fs');
const {PNG} = require('pngjs');
let streams = require('stream');





const aTiles = [];

const PNG_MIME_SIGN = 'data:image/png;base64,';

const sPreviewData64 = "data:image/png;base64,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";

//async function combineTiles


//    let dst = new PNG({width: 32, height: 32});
//dst.pack().pipe(fs.createWriteStream('out.png'));




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

async function savePNGFromString(file, sBase64) {
    const png = await loadPNGFromString(sBase64);
    return savePNG(file, png);
}

/**
 * Turns a buffer into a node js readable stream
 * @param buffer {Buffer} any buffer
 * @return {module:stream.internal.Duplex}
 */
function bufferToStream(buffer) {
    const Duplex = streams.Duplex;
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

/**
 * creates an empty PNG with a size
 * @param width {number} image with
 * @param height
 * @return {PNG}
 */
function createPNG(width, height) {
    return new PNG({width, height});
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
function loadPNGFromString(s) {
    return loadPNGFromBuffer(getPNGBuffer(s));
}

/**
 * turn a base64 image/png into a binary buffer
 * @param imageData {string} base 64 image data
 * @return {Buffer}
 */
function getPNGBuffer(imageData) {
    return Buffer.from(imageData.substr(PNG_MIME_SIGN.length), 'base64');
}

/**
 * Convert a PNG instance into base64 image-data
 * @param png {PNG} the png instance
 * @return {string} base64 version of the png
 */
function pngToBase64(png) {
    return PNG_MIME_SIGN + PNG.sync.write(png).toString('base64')
}

async function appendImages(tilesets, iStart, count) {
    // déterminer la liste des frames à recombiner
    const aAllTiles = [];
    for (let i = 0; i < count; ++i) {
        aAllTiles.push(tilesets[iStart + i].content);
    }
    const proms = aAllTiles.map(t => loadPNGFromString(t));
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

function loadAndPaste(file, pngDest, x, y) {
    return new Promise((resolve, reject) => {

        let w, h;
        fs.createReadStream(file)
            .pipe(new PNG())
            .on('metadata', m => {
                w = m.width;
                h = m.height;
            })
            .on('parsed', data => {
                this.bitblt(pngDest, 16, 16, 32, 32, 0, 0);
                savePNG(file).then(png => resolve(png));
            });
    });
}


function loadPNGToBase64Sync(s) {
    return PNG_MIME_SIGN + fs.readFileSync(s).toString('base64');
}

async function loadTextures() {
    const aTiles = [];
    aTiles.push({
        content: loadPNGToBase64Sync('t0.png')
    });
    aTiles.push({
        content: loadPNGToBase64Sync('t1.png')
    });
    aTiles.push({
        content: loadPNGToBase64Sync('t2.png')
    });
    aTiles.push({
        content: loadPNGToBase64Sync('t3.png')
    });
    return aTiles;
}

async function test1() {
    //loadPNGToBase64('t1.png');
    const aTiles = await loadTextures();
    //console.log(aTiles[0]);
    //savePNG('truc.png', aTiles[0].png);
    const pngStruct = await appendImages(aTiles, 0, 4);
    console.log(pngStruct.src);
    // console.log(pngStruct.width, pngStruct.height);
    return savePNGFromString('test.png', pngStruct.src);
}

//
// const buffPng = getPNGBuffer(sPreviewData64);
// loadPNGFromBuffer(buffPng)
//     .then(png => console.log(png.data))
//     .catch(err => console.error(err));

// test1().catch(e => {
//     console.error('ERR', e.message);
//     console.trace();
// });


PNG.sync.read(sPreviewData64.substr(PNG_MIME_SIGN.length).toString('ascii'));