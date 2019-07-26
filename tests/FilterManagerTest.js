import F from '../lib/src/filters';

describe('#FilterManager', function() {
    it ('should work', function() {
        const fm = new F.FilterManager();
        const f = new F.AbstractFilter();
        expect(fm._filters.length).toBe(0);
        fm.link(f);
        expect(fm._filters.length).toBe(1);
        fm.process(1);
        fm.process(2);
        fm.process(3);
        expect(fm._filters.length).toBe(1);
        f.terminate();
        fm.process(4);
        expect(fm._filters.length).toBe(0);
    });
});