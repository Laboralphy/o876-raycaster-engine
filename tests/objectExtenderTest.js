const OE = require('../src/libs/object-helper/Extender').default;


class MyTestClass {
    myMethod() {
        console.log('fooooooo !');
    }
}

describe('#objectExtender', function() {
    it ('should build a map', function() {
        let a = OE.objectKeyMap({
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
        expect(OE.objectGet(a, 'c.cc')).toBe(10);
        expect(OE.objectGet(a, 'c.bb')).toBe(9);
        expect(OE.objectGet(a, 'b')).toBe(2);
        expect(OE.objectGet(a, 'a')).toBe(1);
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
        OE.objectSet(a, 'c.cc', 'gloup');
        OE.objectSet(a, 'c.bb', 'glap');
        OE.objectSet(a, 'b', 'glip');
        OE.objectSet(a, 'a', 'glup');
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
        OE.objectSet(a, 'c.x', 'gloup');

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
        expect(OE.objectDiffKeys(a, b).missing).toEqual([
            'd',
            'c.x'
        ]);
        expect(OE.objectDiffKeys(a, b).common).toEqual([
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
        OE.objectExtends(a, b);
        expect(a).toEqual({
            a: 9,
            b: 2,
            c: {
                bb: 89,
                cc: 710
            }
        });
    });

    it ('should copy all branches to a new object', function() {
        let a = {
            a: 1,
            b: 2,
            c: {
                bb: 9,
                cc: 10,
                v: 477
            }
        };
        let b = {
            a: 9,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100
            },
            blob: {alpha: 'alpha', beta: 'beta', gamma: 'gamma'}
        };
        OE.objectExtends(a, b, true);
        expect(a).toEqual({
            a: 9,
            b: 2,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100,
                v: 477
            },
            blob: {alpha: 'alpha', beta: 'beta', gamma: 'gamma'}
        });
        a.blob.delta = 'delta';
        expect(a).toEqual({
            a: 9,
            b: 2,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100,
                v: 477
            },
            blob: {alpha: 'alpha', beta: 'beta', gamma: 'gamma', delta: 'delta'}
        });
        expect(b).toEqual({
            a: 9,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100
            },
            blob: {alpha: 'alpha', beta: 'beta', gamma: 'gamma'}
        });

    });
    it ('should copy all branches to a new object even with deep structure', function() {
        let a = {

        };
        let b = {
            a: 9,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100
            },
            blob: {alpha: 'alpha', beta: 'beta', gamma: {
                rays: {are: {very: {hazardous: true}}}
            }}
        };
        OE.objectExtends(a, b, true);
        expect(a).toEqual({
            a: 9,
            d: 7,
            c: {
                bb: 89,
                cc: 710,
                x: 100
            },
            blob: {alpha: 'alpha', beta: 'beta', gamma: {
                    rays: {are: {very: {hazardous: true}}}
                }}
        });
    });


    it('should do well will classes', function() {
        const a = {
            temoins: {
                z: 0
            },
            classes: {}
        };
        OE.objectExtends(a, {temoins: {z: 1}, classes: {MyTestClass}}, true);
        expect(a.temoins.z).toBe(1);
        expect(a.classes.MyTestClass).toBeDefined();
    });

});
