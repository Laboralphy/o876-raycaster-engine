const Reactor = require('../libs/object-helper/Reactor').default;

describe('#reactor', function() {
    it('should work on one level', function() {
        const obj = {
            alpha: 1,
            gamma: 2
        };
        const r = new Reactor();
        expect(obj).toBeDefined();
        r.makeReactiveObject(obj);
        expect(obj).toBeDefined();
        r.clear();
        expect(obj).toBeDefined();
        expect(obj.alpha).toBe(1);
        expect(obj).toBeDefined();
        expect(obj.gamma).toBe(2);
        obj.alpha = 2;
        expect(r._log).toEqual({'alpha': true});
        obj.gamma = 6;
        expect(r._log).toEqual({'alpha': true, 'gamma':true});
        expect(obj.alpha).toBe(2);
        expect(obj.gamma).toBe(6);
    });

    it('should work on array', function() {
        const obj = {
            alpha: [1, 2, 3]
        };
        expect(obj.alpha).toEqual([1, 2, 3]);
        const r = new Reactor(obj);
        r.clear();
        expect(r._log).toEqual({});
        obj.alpha.push(10);
        expect(r._log).toEqual({'alpha': true});
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
        r.clear();
        obj.alpha.beta.x = 1111;
        expect(r._log).toEqual({'alpha.beta.x': true});
    });

    it('should fire events', function() {
        const obj = {
            alpha: {
                beta: {
                    x: 1,
                    y: 2
                }
            }
        };
        const r = new Reactor(obj);
        r.clear();
        let xxx = '';
        r.events.on('changed', ({key}) => {
            xxx = key;
        });
        obj.alpha.beta.y = 22;

        expect(xxx).toBe('alpha.beta.y');
    });
});