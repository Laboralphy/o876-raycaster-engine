class Abbr {

    constructor() {
        this._VOWELS = "";
        this._rVowels = null;
        this.setVowels('aiueoy');
    }

    /**
     * Defines a new list of vowels. In this context vowels are like separators.
     * @param sVowels {string}
     */
    setVowels(sVowels) {
        this._VOWELS = sVowels;
        this._rVowels = new RegExp('[' + sVowels + ']', 'i');
    }

    /**
     * Removes all accent from a string
     * @param str {string}
     * @returns {string}
     */
    static stripAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * returns true if the specified letter is a vowel
     * @param sTest {string} (a letter)
     * @return {boolean}
     */
    isVowel(sTest) {
        return !!sTest.match(this._rVowels);
    }

    /**
     * Abbreviates a string
     * @param str {string}
     * @returns {string}
     */
    make(str) {
        const a = str.split(' ');
        if (a.length > 1) {
            return a.map(x => this.make(x)).join(' ');
        }
        let sx = Abbr.stripAccents(str);
        let sLastChar = sx.substr(0, 1);
        let n = 0;
        if (this.isVowel(sLastChar)) {
            ++n;
        }
        for (let i = 1, len = str.length; i < len; ++i) {
            const sChar = sx.substr(i, 1);
            const v1 = this.isVowel(sLastChar);
            const v2 = this.isVowel(sChar);
            const vv1 = v1 ? 'v' : 'c';
            const vv2 = v2 ? 'v' : 'c';
            if (i > 0 && vv1 + vv2 === 'cv') {
                ++n;
            }
            if (n >= 2) {
                return str.substr(0, i) + '.';
            }
            sLastChar = sChar;
        }
        return str;
    }
}

export default Abbr;
