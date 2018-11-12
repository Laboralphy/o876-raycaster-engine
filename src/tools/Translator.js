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
     * @param alias {string}
     */
    addRule(r, alias) {
        if (r instanceof RegExp) {
            this._rules.push({
                expr: r, alias
            });
        } else {
            this._aliases[r] = alias;
        }
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
}

export default Translator;