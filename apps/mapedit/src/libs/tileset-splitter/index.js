class TilesetSplitter {
    /**
     * Transforms an image into an array of smaller tiles
     * @param sData
     * @param w
     * @param h
     */
    async split(sData, w, h) {
        const oImage = await this.loadImage(sData);
        const nImageWidth = oImage.naturalWidth;
        const nImageHeight = oImage.naturalHeight;
        const aTileset = [];
        const oCanvas = document.createElement('canvas');
        oCanvas.width = w;
        oCanvas.height = h;
        const oContext = oCanvas.getContext('2d');
        for (let y = 0; y < nImageHeight; y += h) {
            for (let x = 0; x < nImageWidth; x += w) {
                oContext.clearRect(0, 0, w, h);
                oContext.drawImage(oImage, x, y, w, h, 0, 0, w, h);
                aTileset.push(oCanvas.toDataURL('image/png'));
            }
        }
        return aTileset;
    }

    loadImage(sData) {
        return new Promise((resolve, reject) => {
            const oImage = new Image();
            oImage.addEventListener('load', event => {
                resolve(oImage);
            });
            oImage.src = sData;
        });
    }
}

export default TilesetSplitter;