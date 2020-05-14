class PixelProcessor {

    static process(oCanvas, cb) {
        let ctx = oCanvas.getContext('2d');
        let oImageData = ctx.createImageData(oCanvas.width, oCanvas.height);
        let pixels = new Uint32Array(oImageData.data.buffer);
        let h = oCanvas.height;
        let w = oCanvas.width;
        let oPixelCtx = {
            pixel: (x, y) => {
                let nOffset = y * w + x;
                let p = pixels[nOffset];
                return {
                    r: p & 0xFF,
                    g: (p >> 8) & 0xFF,
                    b: (p >> 16) & 0xFF,
                    a: (p >> 24) & 0xFF
                };
            },
            width: w,
            height: h,
            x: 0,
            y: 0,
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 255
            }
        };
        let aColors = [];
        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
                let nOffset = y * w + x;
				let p = pixels[nOffset];
                oPixelCtx.x = x;
                oPixelCtx.y = y;
                oPixelCtx.color.r = p && 0xFF;
                oPixelCtx.color.g = (p >> 8) && 0xFF;
                oPixelCtx.color.b = (p >> 16) && 0xFF;
                oPixelCtx.color.a = (p >> 24) && 0xFF;
                cb(oPixelCtx);
                if (!oPixelCtx.color) {
                    throw new Error('pixelprocessor : callback destroyed the color');
                }
                aColors.push({...oPixelCtx.color});
            }
        }
        aColors.forEach((c, i) => {
            pixels[i] = c.r | (c.g << 8) | (c.b << 16) | (c.a << 24);
        });
        ctx.putImageData(oImageData, 0, 0);
    }
}

export default PixelProcessor;