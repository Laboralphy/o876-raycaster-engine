const RangeCollider = require("../libs/range-collider").default;

describe('#range collider', function() {
    it ('should affect point to a correct sector', function() {
        const rc = new RangeCollider(0, 10);
        expect(rc.getPointSector(0)).toBe(2);
        expect(rc.getPointSector(10)).toBe(2);
        expect(rc.getPointSector(-1)).toBe(1);
        expect(rc.getPointSector(-Infinity)).toBe(1);
        expect(rc.getPointSector(99)).toBe(3);
        expect(rc.getPointSector(Infinity)).toBe(3);
    });

    it ('should affect point to a correct sector - range has negative inf boudary', function() {
        const rc = new RangeCollider(-10, 10);
        expect(rc.getPointSector(0)).toBe(2);
        expect(rc.getPointSector(10)).toBe(2);
        expect(rc.getPointSector(-1)).toBe(2);
        expect(rc.getPointSector(-11)).toBe(1);
        expect(rc.getPointSector(-Infinity)).toBe(1);
        expect(rc.getPointSector(99)).toBe(3);
        expect(rc.getPointSector(Infinity)).toBe(3);
    });

    it ('should affect range to a correct sector comparison', function() {
        const rc = new RangeCollider(-10, 10);
        expect(rc.getRangeSectors(1, 2)).toBe(22);
        expect(rc.getRangeSectors(-111, 2)).toBe(12);
        expect(rc.getRangeSectors(-111, 222)).toBe(13);
        expect(rc.getRangeSectors(-1, 222)).toBe(23);
        expect(rc.getRangeSectors(111, 222)).toBe(33);
        expect(rc.getRangeSectors(-111, -50)).toBe(11);
        expect(rc.getRangeSectors(-50, -111)).toBe(11);
    });

    it ('getLeftRelic always should compute 0', function() {
        const rc = new RangeCollider(20, 30);
        expect(rc.getLeftRelic(100, 200)).toBe(0);
        expect(rc.getLeftRelic(25, 200)).toBe(0);
        expect(rc.getLeftRelic(25, 30)).toBe(0);
    });

    it ('getLeftRelic always should compute more than 0', function() {
        const rc = new RangeCollider(20, 30);
        expect(rc.getLeftRelic(10, 200)).toBe(10);
        expect(rc.getLeftRelic(-10, 200)).toBe(30);
        expect(rc.getLeftRelic(-10, -5)).toBe(5);
    });

    it ('getRightRelic always should compute 0', function() {
        const rc = new RangeCollider(20, 30);
        expect(rc.getRightRelic(10, 29)).toBe(0);
        expect(rc.getRightRelic(22, 29)).toBe(0);
        expect(rc.getRightRelic(-22, -20)).toBe(0);
    });

    it ('getRightRelic always should compute more than 0', function() {
        const rc = new RangeCollider(20, 30);
    });
});