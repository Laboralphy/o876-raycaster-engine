const Collider = require('../src/collider/Collider').default;
const Dummy = require('../src/collider/Dummy').default;
const Vector = require('../src/geometry/Vector').default;


describe('#collider', function() {
    describe('basic', function() {
        it('should instanciate', function() {
            const c = new Collider();
            expect(c).toBeDefined();
        });

        describe('Mobile', function() {
            let m1 = new Dummy();
            let m2 = new Dummy();
            m1.radius = 10;
            m2.radius = 15;
            m1.position = new Vector(100, 50);

            it('should not collide : distance 50', function() {
                m2.position = new Vector(100, 100);
                expect(m1.hits(m2)).toBeFalsy();
                expect(m2.hits(m1)).toBeFalsy();
            });


            it('should not collide : distance 25', function() {
                m2.position.set(100, 50 + 10 + 15);
                expect(m1.hits(m2)).toBeFalsy();
                expect(m2.hits(m1)).toBeFalsy();
            });


            it('should collide : distance 24.5', function() {
                m2.position.set(100, 50 + 10 + 14);
                expect(m1.nearerThan(m2, 23)).toBeFalsy();
                expect(m1.nearerThan(m2, 25)).toBeTruthy();
                expect(m1.position.y).toBe(50);
                expect(m2.position.y).toBe(74);
                expect(m2.radius + m1.radius).toBe(15 + 10);
                expect(m1.hits(m2)).toBeTruthy();
                expect(m2.hits(m1)).toBeTruthy();
            });
        });
    });
});