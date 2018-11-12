const Translator = require('../src/tools/Translator').default;

describe('#translator', function() {
    it('should translate', function() {
        const t = new Translator();
        t.addRule('x.y.z', 'v1');
        t.addRule(/^a/, 'v2');
        expect(t.translate('x.y.z')).toBe('v1');
        expect(t.translate('alpha')).toBe('v2');
        expect(t.translate('x.y.z.t')).toBe('x.y.z.t');
    });
});