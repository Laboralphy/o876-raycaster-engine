const Reactor = require('../src/raycaster/Reactor').default;

describe('#reactor', function() {
    it('should work on one level', function() {
        const obj = {
            alpha: 1,
            beta: 2
        };
        const r = new Reactor();
        r.makeReactiveObject(obj);
        expect(obj.alpha).toBe(1);
        expect(obj.beta).toBe(2);
        expect(r._log.length).toBe(0);
        obj.alpha = 2;
        expect(r._log.length).toBe(1);
        expect(r._log).toEqual(['alpha']);
        obj.beta = 6;
        expect(r._log.length).toBe(2);
        expect(r._log).toEqual(['alpha', 'beta']);
        expect(obj.alpha).toBe(2);
        expect(obj.beta).toBe(6);
    });

    it('should work on array', function() {
        const obj = {
            alpha: [1, 2, 3]
        };
        expect(obj.alpha).toEqual([1, 2, 3]);
        const r = new Reactor(obj);
        expect(r._log).toEqual([]);
        obj.alpha.push(10);
        expect(r._log).toEqual(['alpha']);
    });

    it('should work on more level', function() {
        const obj = {
            alpha: {
                beta: {
                    x: 1,
                    y: 2
                }
            }
        };
        const r = new Reactor(obj);
        obj.alpha.beta.x = 1111;
        expect(r._log).toEqual(['alpha.beta.x']);
    });
});