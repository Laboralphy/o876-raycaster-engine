const MemIo = require('../MemIo');

describe('MemIo init', function () {
    it('should instanciate withuout error', function () {
        expect(() => new MemIo()).not.toThrow();
    });
});

describe('createLocation', function () {
    it('should create location', async function () {
        const m = new MemIo();
        await m.createLocation('x');
        expect(m._data).toEqual({ x: {} });
    });

    it('should do nothing when creating location twice', async function () {
        const m = new MemIo();
        await m.createLocation('x');
        await m.createLocation('x');
        expect(m._data).toEqual({ x: {} });
    });
});

describe('write', function () {
    it('should write data', async function () {
        const m = new MemIo();
        await m.createLocation('x');
        await m.write('x', 'f1', { a: 1 });
        expect(m._data).toEqual({ x: { f1: { a: 1 }} });
    });
});

describe('read', function () {
    it('should read { a: 1 } when writing {a: 1}', async function () {
        const m = new MemIo();
        await m.createLocation('x');
        await m.write('x', 'f1', { a: 1 });
        const o1 = await m.read('x', 'f1');
        expect(o1).toEqual({ a: 1 });
    });

    it('should return undefined when read non existant file', async function () {
        const m = new MemIo();
        await m.createLocation('x');
        await m.write('x', 'f1', { a: 1 });
        const o1 = await m.read('x', 'f2');
        expect(o1).toBeUndefined();
    });
});

describe('remove', function () {
    it('should remove previous written item', async function () {
        const m = new MemIo();
        await m.createLocation('x');
        await m.write('x', 'f1', { a: 1 });
        const o1 = await m.read('x', 'f1');
        expect(o1).toEqual({ a: 1 });
        await m.remove('x', 'f1');
        const o2 = await m.read('x', 'f1');
        expect(o2).toBeUndefined();
    });
});
