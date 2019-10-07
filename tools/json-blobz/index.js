const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const Events = require('events');



const TYPES = {
    png: 'data:image/png;base64',
    jpg: 'data:image/jpeg;base64'
};

/**
 * This class will parse an object and produce a JSON and a collection of hashed resources matching the base 64
 * encoded blobs inside the json.
 */
class JsonBlobz {

    constructor() {
        this._separator = '';
        this._events = new Events();
    }

    /**
     * Turns a base64 encode image into a blob
     * @param sBase64 {string} base64 encode image
     */
    imageDataToBinary(sBase64) {
        const i = sBase64.indexOf(',');
        return Buffer.from(sBase64.substr(i + 1), 'base64');
    }

    binaryToImageData(buf, type) {
        return TYPES[type] + ',' + Buffer.from(buf).toString('base64');
    }

    getSignatureType(sBase64) {
        const SIGN_PNG = TYPES.png;
        const SIGN_JPEG = TYPES.jpg;
        if (typeof sBase64 !== 'string') {
            return '';
        }
        if (sBase64.startsWith(SIGN_PNG)) {
            return 'png';
        }
        if (sBase64.startsWith(SIGN_JPEG)) {
            return 'jpg';
        }
        return '';
    }

    /**
     * The function will extract base64 encoded image data blobs inside the given JSON.
     * an asynchronous function will be called back to deal with blobs
     * @param data
     * @param pFunction
     */
    async deblob(data, pFunction) {
        const outputBlobs = {};
        const outputData = this.walk(data, (key, value) => {
            if (typeof value === 'string') {
                const type = this.getSignatureType(value);
                if (type !== '') {
                    const blob = this.imageDataToBinary(value);
                    const hash = crypto.createHash('MD5').update(blob).digest('hex');
                    outputBlobs[hash + '.' + type] = blob;
                    return hash + '.' + type;
                }
            }
            return value;
        });
        if (!!pFunction) {
            await pFunction(outputBlobs);
        }
        return outputData;
    }


    /**
     * for each item containing a "file:" tag, loads the matching resource and fills the value
     * @param data
     * @param pFunction
     * @return {Promise<void>}
     */
    async reblob(data, pFunction) {
        const blobs = {};
        // première passe
        this.walk(data, (key, value) => {
            if (typeof value === 'string') {
                const rx = value.match(/^([0-9a-f]{32}\.(jpg|png))$/i);
                if (!!rx) {
                    const hash = rx[1];
                    blobs[hash] = true;
                }
                return value;
            } else {
                return value;
            }
        });
        // chargement des blobs
        if (!!pFunction) {
            const oImages = await pFunction(Object.keys(blobs));
            // seconde passe
            return this.walk(data, (key, value) => {
                if (typeof value === 'string') {
                    const rx = value.match(/^([0-9a-f]{32}\.(jpg|png))$/i);
                    if (!!rx) {
                        const hash = rx[1];
                        const type = rx[2];
                        if (hash in oImages) {
                            return this.binaryToImageData(oImages[hash], type);
                        } else {
                            throw new Error('error while fetching resource "' + hash + '"');
                        }
                    }
                    return value;
                } else {
                    return value;
                }
            });
        } else {
            throw new Error('this function needs a promise as 2nd parameter');
        }
    }


    walk(data, pWalker) {
        return JSON.parse(JSON.stringify(data, pWalker));
    }
}

module.exports = JsonBlobz;