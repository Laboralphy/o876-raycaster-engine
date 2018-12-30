/**
 * this class translates a string or a regular expression into another string
 */
class Translator {
    constructor() {
        this._rules = [];
        this._aliases = {};
    }

    /**
     * adds a rule
     * @param r {string|RegExp}
     * @param alias {string|number|boolean}
     */
    addRule(r, alias) {
        if (r instanceof RegExp) {
            this._rules.push({
                expr: r, alias
            });
        } else {
            this._aliases[r] = alias;
        }
        return this;
    }

    /**
     * Translates a string
     * @param s {string}
     * @returns {string}
     */
    translate(s) {
        if (s in this._aliases) {
            return this._aliases[s];
        }
        for (let iRule = 0, l = this._rules.length; iRule < l; ++iRule) {
            let r = this._rules[iRule];
            if (s.match(r.expr)) {
                return r.alias;
            }
        }
        return s;
    }

    translateItem(xItem) {
        switch (typeof xItem) {
            case 'object':
                return Array.isArray(xItem)
                    ? xItem.map(x => this.translateItem(x))
                    : this.translateStructure(xItem);

            case 'string':
                return this.translate(xItem);

            default:
                return xItem;
        }
    }

    /**
     * Deep-translates an ENTIRE structure
     * @param oStructure {*}
     */
    translateStructure(oStructure) {
        if (oStructure === null) {
            return null;
        }
        const oNewStructure = {};
        for (let s in oStructure) {
            const st = oStructure[s];
            oNewStructure[s] = this.translateItem(st);
        }
        return oNewStructure;
    }
}

export default Translator;