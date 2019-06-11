const Translator = require('../lib/src/translator/Translator').default;

describe('#translator', function() {
    it('should translate', function() {
        const t = new Translator();
        t.addRule('x.y.z', 'v1');
        t.addRule(/^a/, 'v2');
        expect(t.translate('x.y.z')).toBe('v1');
        expect(t.translate('alpha')).toBe('v2');
        expect(t.translate('x.y.z.t')).toBe('x.y.z.t');
    });

    it('should translate a structure', function() {
        const t = new Translator();
        t.addRule('x.y.z', 'v1');
        t.addRule(/^a/, 'v2');
        expect(t.translateStructure({
            loop: 'x.y.z',
            a: [1, false, 'ddd', 'abc', {test: 'alpha'}],
            x: null
        })).toEqual({
            loop: 'v1',
            a: [1, false, 'ddd', 'v2', {test: 'v2'}],
            x: null
        });
    });
});