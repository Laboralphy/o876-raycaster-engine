import Location from "../src/engine/Location";

describe('#Location', function() {
    describe('basic', function() {
        it('should be initialized', function() {
            const l = new Location();
            expect(l instanceof Location).toBeTruthy();
            expect(l.x).toBe(0);
            expect(l.y).toBe(0);
            expect(l.z).toBe(0);
            expect(l.angle).toBe(0);
            expect(l.area).toBe(null);
        });
    });

    describe('set', function() {
        it('l1 should be copied into l2', function() {
            const l1 = new Location({x: 5, y: 10, z: 15, angle: 20, area: 'abc'});
            const l2 = new Location();
            expect(l2.x).toBe(0);
            l2.set(l1);
            expect(l2.x).toBe(5);
            expect(l2.y).toBe(10);
            expect(l2.z).toBe(15);
            expect(l2.angle).toBe(20);
            expect(l2.area).toBe('abc');
        });
    });
});