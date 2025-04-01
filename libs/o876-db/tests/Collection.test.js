const Collection = require('../Collection');
const MemIo = require('../MemIo');

describe('constructor', function () {
    it('should not throw error when instanciating collection', async function () {
        expect(() => new Collection('x')).not.toThrow();
    });
});

describe('init', function () {
    it('should create location x when init collection with path x', async function () {
        const c = new Collection('x');
        const m = new MemIo();
        c.io = m;
        await c.init();
        expect(m._data).toEqual({ x: {} });
    });
});

describe('save', function () {
    it('should save document without error', async function () {
        const c = new Collection('x');
        const m = new MemIo();
        c.io = m;
        await c.init();
        await c.save({ id: 1, text: 't1' });
        await c.save({ id: 2, text: 't2' });
        expect(m._data).toEqual({ x: { '1': { id: 1, text: 't1' }, '2': { id: 2, text: 't2' } } });
    });
});

describe('get', function () {
    it('should get document previously saved', async function () {
        const c = new Collection('x');
        const m = new MemIo();
        c.io = m;
        await c.init();
        await c.save({ id: 1, text: 't1' });
        await c.save({ id: 2, text: 't2' });
        expect(await c.get(2)).toEqual({ id: 2, text: 't2' });
    });
    it('should return undefined when document cannot be found', async function () {
        const c = new Collection('x');
        const m = new MemIo();
        c.io = m;
        await c.init();
        await c.save({ id: 1, text: 't1' });
        await c.save({ id: 2, text: 't2' });
        expect(await c.get(3)).toBeUndefined();
    });
});

describe('find', function () {
    it('should find document when no indexation is donne on collection', async function () {
        const c = new Collection('x');
        const m = new MemIo();
        c.io = m;
        await c.init();
        await c.save({ id: 1, text: 't1' });
        await c.save({ id: 2, text: 't2' });
        await c.save({ id: 3, text: 't1' });
        await c.save({ id: 4, text: 't3' });
        await c.save({ id: 5, text: 't1' });
        await c.save({ id: 6, text: 't3' });
        await c.save({ id: 7, text: 't3' });
        await c.save({ id: 8, text: 't2' });
        await c.save({ id: 9, text: 't1' });
        await c.save({ id: 10, text: 't2' });

        const cursor = await c.find({ text: 't2' });
        expect(await cursor.first()).toEqual({ id: 2, text: 't2' });
        expect(await cursor.next()).toEqual({ id: 8, text: 't2' });
        expect(await cursor.next()).toEqual({ id: 10, text: 't2' });
        expect(await cursor.previous()).toEqual({ id: 8, text: 't2' });
        await cursor.next();
        expect(await cursor.next()).toBeNull();
        expect(await cursor.toArray()).toEqual([
            { id: 2, text: 't2' },
            { id: 8, text: 't2' },
            { id: 10, text: 't2' }
        ]);

        const cursor2 = await c.find({ text: 't3' });
        expect(await cursor2.first()).toEqual({ id: 4, text: 't3' });
        expect(await cursor2.next()).toEqual({ id: 6, text: 't3' });
        expect(await cursor2.next()).toEqual({ id: 7, text: 't3' });

        const cursor3 = await c.find({ text: 't2', id: { $gte: 8 }});
        expect(await cursor3.toArray()).toEqual([
            { id: 8, text: 't2' },
            { id: 10, text: 't2' }
        ]);

        const cursorOr = await c.find({ $or: [{ text: 't3' }, { text: 't2' }]});
        expect(cursorOr.keys).toBeInstanceOf(Array);
        expect((await cursorOr.toArray()).sort((a, b) => a.id - b.id)).toEqual([
            { id: 2, text: 't2' },
            { id: 4, text: 't3' },
            { id: 6, text: 't3' },
            { id: 7, text: 't3' },
            { id: 8, text: 't2' },
            { id: 10, text: 't2' }
        ]);

        const cursorAnd = await c.find({ $and: [{ text: 't1' }, { id: { $lte: 5 } }]});
        expect(cursorAnd.keys).toBeInstanceOf(Array);
        expect((await cursorAnd.toArray()).sort((a, b) => a.id - b.id)).toEqual([
            { id: 1, text: 't1' },
            { id: 3, text: 't1' },
            { id: 5, text: 't1' }
        ]);

        const cursorAnd2 = await c.find({ text: 't1', id: { $lte: 5 }});
        expect(cursorAnd2.keys).toBeInstanceOf(Array);
        expect((await cursorAnd2.toArray()).sort((a, b) => a.id - b.id)).toEqual([
            { id: 1, text: 't1' },
            { id: 3, text: 't1' },
            { id: 5, text: 't1' }
        ]);

        const cursorNot = await c.find({ $not: { text: 't2' } });
        expect((await cursorNot.toArray()).sort((a, b) => a.id - b.id)).toEqual([
            { id: 1, text: 't1' },
            { id: 3, text: 't1' },
            { id: 4, text: 't3' },
            { id: 5, text: 't1' },
            { id: 6, text: 't3' },
            { id: 7, text: 't3' },
            { id: 9, text: 't1' }
        ]);
    });
});
