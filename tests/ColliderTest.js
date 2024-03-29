const Collider = require('../libs/smasher/Smasher').default;
const Dummy = require('../libs/smasher/Dummy').default;
const Vector = require('../libs/geometry/Vector').default;


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


    // TODO ce test est totalement obsolète et doit etre changé
    describe('force-field', function() {
        describe('Mobile', function() {

            it('should add a single force toward south', function() {
                const collider = new Collider();

                let m1 = new Dummy();
                m1.radius = 10;
                m1.position = new Vector(100, 100);
                const e1 = { dummy: m1 }

                let m2 = new Dummy();
                m2.radius = 10;
                m2.position = new Vector(120, 100);
                const e2 = { dummy: m2 }

                let m3 = new Dummy();
                m3.radius = 10;
                m3.position = new Vector(110, 102);
                const e3 = { dummy: m3 }

                collider.grid.width = 10
                collider.grid.height = 10
                collider.setCellWidth(64)
                collider.setCellHeight(64)

                collider.updateEntity(e1);
                collider.updateEntity(e2);
                collider.updateEntity(e3);

                /*
                collider.computeCollidingForces(m3, [m1, m2]);

                expect(m3.forceField.forces[0].v.x).toBeCloseTo(4.806, 3);
                expect(m3.forceField.forces[0].v.y).toBeCloseTo(0.961, 3);

                expect(m3.forceField.forces.length).toBe(2);
                const rf = m3.forceField.computeForces();
                expect(rf.x).toBe(0);
                expect(rf.y).toBeCloseTo(1.922, 3);

                m3.forceField.reduceForces();
                expect(m3.forceField.forces.length).toBe(0);*/
            });
        });
    });
});