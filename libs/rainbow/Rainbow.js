/**
 * @class O876.Rainbow
 * Rainbow - Color Code Convertor Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 * good to GIT
 */

const COLORS = {
    aliceblue : '#F0F8FF',
    antiquewhite : '#FAEBD7',
    aqua : '#00FFFF',
    aquamarine : '#7FFFD4',
    azure : '#F0FFFF',
    beige : '#F5F5DC',
    bisque : '#FFE4C4',
    black : '#000000',
    blanchedalmond : '#FFEBCD',
    blue : '#0000FF',
    blueviolet : '#8A2BE2',
    brown : '#A52A2A',
    burlywood : '#DEB887',
    cadetblue : '#5F9EA0',
    chartreuse : '#7FFF00',
    chocolate : '#D2691E',
    coral : '#FF7F50',
    cornflowerblue : '#6495ED',
    cornsilk : '#FFF8DC',
    crimson : '#DC143C',
    cyan : '#00FFFF',
    darkblue : '#00008B',
    darkcyan : '#008B8B',
    darkgoldenrod : '#B8860B',
    darkgray : '#A9A9A9',
    darkgrey : '#A9A9A9',
    darkgreen : '#006400',
    darkkhaki : '#BDB76B',
    darkmagenta : '#8B008B',
    darkolivegreen : '#556B2F',
    darkorange : '#FF8C00',
    darkorchid : '#9932CC',
    darkred : '#8B0000',
    darksalmon : '#E9967A',
    darkseagreen : '#8FBC8F',
    darkslateblue : '#483D8B',
    darkslategray : '#2F4F4F',
    darkslategrey : '#2F4F4F',
    darkturquoise : '#00CED1',
    darkviolet : '#9400D3',
    deeppink : '#FF1493',
    deepskyblue : '#00BFFF',
    dimgray : '#696969',
    dimgrey : '#696969',
    dodgerblue : '#1E90FF',
    firebrick : '#B22222',
    floralwhite : '#FFFAF0',
    forestgreen : '#228B22',
    fuchsia : '#FF00FF',
    gainsboro : '#DCDCDC',
    ghostwhite : '#F8F8FF',
    gold : '#FFD700',
    goldenrod : '#DAA520',
    gray : '#808080',
    grey : '#808080',
    green : '#008000',
    greenyellow : '#ADFF2F',
    honeydew : '#F0FFF0',
    hotpink : '#FF69B4',
    indianred  : '#CD5C5C',
    indigo  : '#4B0082',
    ivory : '#FFFFF0',
    khaki : '#F0E68C',
    lavender : '#E6E6FA',
    lavenderblush : '#FFF0F5',
    lawngreen : '#7CFC00',
    lemonchiffon : '#FFFACD',
    lightblue : '#ADD8E6',
    lightcoral : '#F08080',
    lightcyan : '#E0FFFF',
    lightgoldenrodyellow : '#FAFAD2',
    lightgray : '#D3D3D3',
    lightgrey : '#D3D3D3',
    lightgreen : '#90EE90',
    lightpink : '#FFB6C1',
    lightsalmon : '#FFA07A',
    lightseagreen : '#20B2AA',
    lightskyblue : '#87CEFA',
    lightslategray : '#778899',
    lightslategrey : '#778899',
    lightsteelblue : '#B0C4DE',
    lightyellow : '#FFFFE0',
    lime : '#00FF00',
    limegreen : '#32CD32',
    linen : '#FAF0E6',
    magenta : '#FF00FF',
    maroon : '#800000',
    mediumaquamarine : '#66CDAA',
    mediumblue : '#0000CD',
    mediumorchid : '#BA55D3',
    mediumpurple : '#9370DB',
    mediumseagreen : '#3CB371',
    mediumslateblue : '#7B68EE',
    mediumspringgreen : '#00FA9A',
    mediumturquoise : '#48D1CC',
    mediumvioletred : '#C71585',
    midnightblue : '#191970',
    mintcream : '#F5FFFA',
    mistyrose : '#FFE4E1',
    moccasin : '#FFE4B5',
    navajowhite : '#FFDEAD',
    navy : '#000080',
    oldlace : '#FDF5E6',
    olive : '#808000',
    olivedrab : '#6B8E23',
    orange : '#FFA500',
    orangered : '#FF4500',
    orchid : '#DA70D6',
    palegoldenrod : '#EEE8AA',
    palegreen : '#98FB98',
    paleturquoise : '#AFEEEE',
    palevioletred : '#DB7093',
    papayawhip : '#FFEFD5',
    peachpuff : '#FFDAB9',
    peru : '#CD853F',
    pink : '#FFC0CB',
    plum : '#DDA0DD',
    powderblue : '#B0E0E6',
    purple : '#800080',
    rebeccapurple : '#663399',
    red : '#FF0000',
    rosybrown : '#BC8F8F',
    royalblue : '#4169E1',
    saddlebrown : '#8B4513',
    salmon : '#FA8072',
    sandybrown : '#F4A460',
    seagreen : '#2E8B57',
    seashell : '#FFF5EE',
    sienna : '#A0522D',
    silver : '#C0C0C0',
    skyblue : '#87CEEB',
    slateblue : '#6A5ACD',
    slategray : '#708090',
    slategrey : '#708090',
    snow : '#FFFAFA',
    springgreen : '#00FF7F',
    steelblue : '#4682B4',
    tan : '#D2B48C',
    teal : '#008080',
    thistle : '#D8BFD8',
    tomato : '#FF6347',
    turquoise : '#40E0D0',
    violet : '#EE82EE',
    wheat : '#F5DEB3',
    white : '#FFFFFF',
    whitesmoke : '#F5F5F5',
    yellow : '#FFFF00',
    yellowgreen : '#9ACD32'
};

class Rainbow {
    /**
     * Concatenates an array of 4bits value into an int
     * @param n {number[]}
     * @return {number}
     */
    static nibbles(...n) {
        let r = 0;
        for (let i = 0, l = n.length; i < l; ++i) {
            r = (r << 4) | n[i];
        }
        return r;
    }

    /**
     * Turns a HTML color code into a rgba structure where each items is a 8 bits value.
     * @param sColor {string}
     * @return {r, g, b, a}
     */
    static parse(sColor) {
        if (typeof sColor === 'object') {
            return sColor;
        }
        sColor = sColor.toLowerCase();
        if (sColor in COLORS) {
            sColor = COLORS[sColor];
        }
        if (sColor.substr(0, 1) === '#') {
            sColor = sColor.substr(1);
        }
        switch (sColor.length) {
            case 3: {
                let n = parseInt('0x' + sColor);
                let nr = (n >> 8) & 0xF;
                let ng = (n >> 4) & 0xF;
                let nb = n & 0xF;
                let r = Rainbow.nibbles(nr, nr);
                let g = Rainbow.nibbles(ng, ng);
                let b = Rainbow.nibbles(nb, nb);
                let a = 255;
                return {r, g, b, a};
            }

            case 6: {
                let n = parseInt('0x' + sColor);
                let r = (n >> 16) & 0xFF;
                let g = (n >> 8) & 0xFF;
                let b = n & 0xFF;
                let a = 255;
                return {r, g, b, a};
            }

            default: {
                let rx;
                if (rx = sColor.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/)) {
                    return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0, a: 255};
                } else if (rx = sColor.match(/^rgba\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([.0-9]+) *\)$/)) {
                    return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0, a: 255 * parseFloat(rx[4]) | 0};
                } else {
                    throw new Error('invalid color structure ' + sColor);
                }
            }
        }
    }

    /**
     * Makes a color CSS string out of an {r, g, b, a} structure
     * @param xData {{r, g, b, a}}
     * @return {string}
     */
    static rgba(xData) {
        const oData = Rainbow.parse(xData);
        let s1 = 'rgb';
        let s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
        if ('a' in oData) {
            s1 += 'a';
            s2 += ', ' + (oData.a.toString() / 255);
        }
        return s1 + '(' + s2 + ')';
    }

    /**
     * Makes a spectrum between two colors
     * @param sColor1 {string} first color
     * @param sColor2 {string} second color
     * @param nSteps {number} step count
     * @return {string[]}
     */
    static spectrum(sColor1, sColor2, nSteps) {
        let c1 = Rainbow.parse(sColor1);
        let c2 = Rainbow.parse(sColor2);

        function getMedian(x1, x2) {
            if (x1 === undefined) {
                throw new Error('first color is undefined');
            }
            if (x2 === undefined) {
                throw new Error('second color is undefined');
            }
            return {
                r: (x1.r + x2.r) >> 1,
                g: (x1.g + x2.g) >> 1,
                b: (x1.b + x2.b) >> 1,
                a: (x1.a + x2.a) >> 1
            };
        }

        function fillArray(a, x1, x2, n1, n2) {
            if (Math.abs(n1 - n2) < 1) {
                return a;
            }
            let m = getMedian(x1, x2);
            let n = (n1 + n2) >> 1;
            if (Math.abs(n1 - n2) > 1) {
                fillArray(a, x1, m, n1, n);
                fillArray(a, m, x2, n, n2);
            }
            a[n1] = x1;
            a[n2] = x2;
            return a;
        }

        return fillArray([], c1, c2, 0, nSteps - 1)
            .map(c => Rainbow.rgba(c));
    }

    /**
     * Generates a gradient
     * @param oPalette {*} palette definition
     * The palette is an object with key:value pairs.
     * - The keys are color indices
     * - The values are color values
     * Rainbow.gradient({
     * 		start: value,
     * 		stop1: value,
     * 		stop2: value,
     * 		...
     * 		stopN: value,
     * 		end: value
     * })
     * @example
     * Rainbow.gradient({
     * 		0: '#00F',
     * 		50: '#FF0',
     * 		100: '#F00'
     * })
     */
    static gradient(oPalette) {
        let aPalette = [];
        let sColor;
        let sLastColor = null;
        let nPal;
        let nLastPal = 0;
        for (let iPal in oPalette) {
            nPal = iPal | 0;
            sColor = oPalette[iPal];
            if (sLastColor !== null) {
                aPalette = aPalette.concat(Rainbow.spectrum(sLastColor, sColor, nPal - nLastPal + 1).slice(1));
            } else {
                aPalette[nPal] = this.rgba(sColor);
            }
            sLastColor = sColor;
            nLastPal = nPal;
        }
        return aPalette;
    }
}
export default Rainbow;
