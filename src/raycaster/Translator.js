/**
 * this class translates a string into another string
 */
class Translator {
    constructor() {
        this._rules = [];
        this._aliases = {};
    }

    addRule(r, alias) {
        if (r instanceof RegExp) {
            this._rules.push({
                expr: r, alias
            });
        } else {
            this._aliases[r] = alias;
        }
    }

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