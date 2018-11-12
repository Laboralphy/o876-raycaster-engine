const {objectKeyMap, objectSet, objectGet, objectDiffKeys, objectExtends} = require('../src/tools/objectExtender');

describe('#objectExtender', function() {
    it ('should build a map', function() {
        let a = objectKeyMap({
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10
            }
        });
        expect(a).toEqual(['a', 'b', 'c.bb', 'c.cc']);
    });
    it ('should get an object item', function() {
        let a = {
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10
            }
        };
        expect(objectGet(a, 'c.cc')).toBe(10);
        expect(objectGet(a, 'c.bb')).toBe(9);
        expect(objectGet(a, 'b')).toBe(2);
        expect(objectGet(a, 'a')).toBe(1);
    });
    it ('should set an object item value', function() {
        let a = {
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10
            }
        };
        objectSet(a, 'c.cc', 'gloup');
        objectSet(a, 'c.bb', 'glap');
        objectSet(a, 'b', 'glip');
        objectSet(a, 'a', 'glup');
        expect(a).toEqual({
            a: 'glup',
            b: 'glip',
            c: {
                bb: 'glap',
                cc: 'gloup'
            }
        });
    });
    it ('should deal with error', function() {
        let a = {
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10
            }
        };
        objectSet(a, 'c.x', 'gloup');

    });
    it ('should deal with missing branches', function() {
        let a = {
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10
            }
        };
        let b = {
            a: 9,
            d: 7,
            c: {
                bb: 9,
                cc: 10,
                x: 100
            }
        };
        expect(objectDiffKeys(a, b).missing).toEqual([
            'd',
            'c.x'
        ]);
        expect(objectDiffKeys(a, b).common).toEqual([
            'a',
            'c.bb',
            'c.cc',
        ]);
    });

    it ('should copy', function() {
        let a = {
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10
            }
        };
        let b = {
            a: 9,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100
            }
        };
        objectExtends(a, b);
        expect(a).toEqual({
            a: 9,
            b: 2,
            c: {
                bb: 89,
                cc: 710
            }
        });
    });
});
