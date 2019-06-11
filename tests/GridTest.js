import Grid from "../lib/src/grid/Grid";

describe('#grid', function() {
    describe('clipAxis', function () {
        it ('segment outside (neg)', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(-10, 5, 10)).toBeFalsy();
        });
        it ('segment outside (pos)', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(10, 5, 10)).toBeFalsy();
        });
        it ('segment very large', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(-10, 50, 10)).toEqual({n: 0, w: 10});
        });
        it ('segment same size', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(0, 10, 10)).toEqual({n: 0, w: 10});
        });
        it ('segment smaller', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(5, 2, 10)).toEqual({n: 5, w: 2});
        });
        it ('segment left clipped', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(-3, 6, 10)).toEqual({n: 0, w: 3});
        });
        it ('other test', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(-3, 6, 5)).toEqual({n: 0, w: 3});
        });
        it ('segment right clipped', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            expect(g.clipAxis(7, 6, 10)).toEqual({n: 7, w: 3});
        });
    });
    describe('getRegion', function () {
        it ('should return 0, 0, 3, 3', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            let c = g.getRegion(-3, -3, 6, 6);
            expect(c).not.toBeFalsy();
            expect(c).toEqual({x: 0, y: 0, w: 3, h: 3});
        });
    });
    describe('iterateRegion', function () {
        it ('should iterate from 0,0 to 2,2', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            let a = [];
            g.iterateRegion(0, 0, 3, 3, function(x, y, n) {
                a.push('[' + x + ';' + y + ']');
                return n;
            });
            expect(a.join('')).toBe('[0;0][1;0][2;0][0;1][1;1][2;1][0;2][1;2][2;2]');
        });
    });
    describe('iterateRegion', function () {
        it ('should iterate from 8,4 to 9,4', function() {
            const g = new Grid();
            g.setWidth(10);
            g.setHeight(5);
            let a = [];
            g.iterateRegion(8, 4, 13, 23, function(x, y, n) {
                a.push('[' + x + ';' + y + ']');
                return n;
            });
            expect(a.join('')).toBe('[8;4][9;4]');
        });
    });
});
