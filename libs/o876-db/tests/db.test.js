const db = require('../index');
const path = require('path');
const INDEX_TYPES = db.INDEX_TYPES;
const MemIo = db.io.mem;
const DbIndex = require('../DbIndex');

const TMP_DIR = 'o876dbTest';


describe('Indexer', function () {
    it('index simple', function () {
        const oIndexer = new db.Indexer();
        oIndexer.createIndex('name', { unique: true });
        oIndexer.createIndex('element');
        oIndexer.addIndexedValue('name', 'shiva', 100);
        oIndexer.addIndexedValue('name', 'ifrit', 118);
        oIndexer.addIndexedValue('name', 'ramuh', 122);
        oIndexer.addIndexedValue('name', 'ondine', 137);
        oIndexer.addIndexedValue('name', 'bahamut', 150);
        oIndexer.addIndexedValue('name', 'ixion', 153);
        oIndexer.addIndexedValue('name', 'odin', 190);
        oIndexer.addIndexedValue('name', 'titan', 1993);
        oIndexer.addIndexedValue('element', 'ice', 100);
        oIndexer.addIndexedValue('element', 'fire', 118);
        oIndexer.addIndexedValue('element', 'thunder', 122);
        oIndexer.addIndexedValue('element', 'water', 137);
        oIndexer.addIndexedValue('element', 'none', 150);
        oIndexer.addIndexedValue('element', 'thunder', 153);
        oIndexer.addIndexedValue('element', 'divine', 190);
        oIndexer.addIndexedValue('element', 'earth', 1993);
        expect(oIndexer.search('name', 'ramuh')).toEqual(['122']);
        expect(oIndexer.search('element', 'thunder')).toEqual(['122', '153']);
    });
    it('index removal simple', function () {
        const oIndexer = new db.Indexer();
        oIndexer.createIndex('name', { unique: true });
        oIndexer.createIndex('element');
        oIndexer.addIndexedValue('name', 'shiva', 100);
        oIndexer.addIndexedValue('name', 'ifrit', 118);
        oIndexer.addIndexedValue('name', 'ramuh', 122);
        oIndexer.addIndexedValue('name', 'ondine', 137);
        oIndexer.addIndexedValue('name', 'bahamut', 150);
        oIndexer.addIndexedValue('name', 'ixion', 153);
        oIndexer.addIndexedValue('name', 'odin', 190);
        oIndexer.addIndexedValue('name', 'titan', 1993);
        oIndexer.addIndexedValue('element', 'ice', 100);
        oIndexer.addIndexedValue('element', 'fire', 118);
        oIndexer.addIndexedValue('element', 'thunder', 122);
        oIndexer.addIndexedValue('element', 'water', 137);
        oIndexer.addIndexedValue('element', 'none', 150);
        oIndexer.addIndexedValue('element', 'thunder', 153);
        oIndexer.addIndexedValue('element', 'divine', 190);
        oIndexer.addIndexedValue('element', 'earth', 1993);
        oIndexer.removeIndexedValue('element', 'thunder', 122);
        expect(oIndexer.search('element', 'thunder')).toEqual(['153']);
    });
});

async function seedData (oColl) {
    await oColl.save({
        id: 1,
        name: 'ifrit',
        element: 'fire'
    });
    await oColl.save({
        id: 2,
        name: 'shiva',
        element: 'ice'
    });
    await oColl.save({
        id: 3,
        name: 'ramuh',
        element: 'thunder'
    });
    await oColl.save({
        id: 4,
        name: 'bahamut',
        element: ''
    });
    await oColl.save({
        id: 5,
        name: 'ondine',
        element: 'water'
    });
    await oColl.save({
        id: 6,
        name: 'leviathan',
        element: 'water'
    });
    await oColl.save({
        id: 7,
        name: 'ixion',
        element: 'thunder'
    });
    await oColl.save({
        id: 8,
        name: 'titan',
        element: 'earth'
    });
    await oColl.save({
        id: 9,
        name: 'odin',
        element: 'divine'
    });
    await oColl.save({
        id: 10,
        name: 'alexander',
        element: 'light'
    });
}

describe('collection queries', function () {
    it('finds by get', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c1'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const aAllKeys = await c.keys;
        const aSortedKeys = aAllKeys
            .map(k => k | 0)
            .sort((a, b) => a - b);
        expect(aSortedKeys).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const doc = await c.get(1);
        expect(doc).toEqual({ id: 1, name: 'ifrit', element: 'fire' });
        await c.drop();
    });
    it('finds by predicate', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c2'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const doc = await c.find(d => d.name === 'shiva').then(curs => curs.toArray());
        expect(doc).toEqual([{ id: 2, name: 'shiva', element: 'ice' }]);
        await c.drop();
    });
    it('finds non existing', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c3'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const doc = await c.find(d => d.name === 'xxx').then(curs => curs.toArray());
        expect(doc).toEqual([]);
        await c.drop();
    });
    it('finds by one non-indexed value', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c4'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const doc = await c._findByNonIndexedValues({ name: 'shiva' });
        expect(doc).toEqual(['2']);
        await c.drop();
    });
    it('finds by multiple non-indexed value', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c5'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const doc = await c._findByNonIndexedValues({ name: 'ramuh', element: 'thunder' });
        expect(doc).toEqual(['3']);
        const doc2 = await c._findByNonIndexedValues({ name: 'ixion', element: 'thunder' });
        expect(doc2).toEqual(['7']);
        await c.drop();
    });
});

describe('collection and index', function () {
    it('create an single index BEFORE seed', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c10'));
        c.io = new MemIo();
        await c.init();
        await c.createIndex('element');
        await seedData(c);
        expect(c.index.data.has('element')).toBeTruthy();
        expect(c.index.data.get('element')).toHaveProperty('values');
        expect(c.index.data.get('element').values.has('fire')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('fire')]).toEqual(['1']);
        expect(c.index.data.get('element').values.has('ice')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('ice')]).toEqual(['2']);
        expect(c.index.data.get('element').values.has('thunder')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('thunder')].sort((a, b) => parseInt(a) - parseInt(b))).toEqual(['3', '7']);
        expect(c.index.data.get('element').values.has('')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('')]).toEqual(['4']);
        expect(c.index.data.get('element').values.has('water')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('water')].sort((a, b) => parseInt(a) - parseInt(b))).toEqual(['5', '6']);
        expect(c.index.data.get('element').values.has('earth')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('earth')]).toEqual(['8']);
        expect(c.index.data.get('element').values.has('divine')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('divine')]).toEqual(['9']);
        expect(c.index.data.get('element').values.has('light')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('light')]).toEqual(['10']);
    });
    it('create a single index AFTER seed', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c11'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        await c.createIndex('element');
        expect(c.index.data.has('element')).toBeTruthy();
        expect(c.index.data.get('element')).toHaveProperty('values');
        expect(c.index.data.get('element').values.has('fire')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('fire')]).toEqual(['1']);
        expect(c.index.data.get('element').values.has('ice')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('ice')]).toEqual(['2']);
        expect(c.index.data.get('element').values.has('thunder')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('thunder')].sort((a, b) => parseInt(a) - parseInt(b))).toEqual(['3', '7']);
        expect(c.index.data.get('element').values.has('')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('')]).toEqual(['4']);
        expect(c.index.data.get('element').values.has('water')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('water')].sort((a, b) => parseInt(a) - parseInt(b))).toEqual(['5', '6']);
        expect(c.index.data.get('element').values.has('earth')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('earth')]).toEqual(['8']);
        expect(c.index.data.get('element').values.has('divine')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('divine')]).toEqual(['9']);
        expect(c.index.data.get('element').values.has('light')).toBeTruthy();
        expect([...c.index.data.get('element').values.get('light')]).toEqual(['10']);
    });
    it('find zero document', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c12'));
        c.io = new MemIo();
        await c.init();
        c._explain = true;
        await seedData(c);
        await c.createIndex('element');
        const aDocs = await c.find({ x: 15, y: 12 }).then(curs => curs.toArray());
        expect(aDocs).toHaveLength(0);
    });
    it('find documents 1', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c13'));
        c.io = new MemIo();
        await c.init();
        c._explain = true;
        await seedData(c);
        await c.createIndex('element');
        const aDocs = await c.find({ element: 'water' }).then(curs => curs.toArray());
        aDocs.sort((a, b) => a.id - b.id);
        expect(aDocs).toHaveLength(2);
        expect(aDocs[0].id).toBe(5);
        expect(aDocs[1].id).toBe(6);
    });
    it('find documents by mixed clauses', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c13'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        await c.createIndex('element');
        const aDocs = await c.find({ element: 'water', name: 'ondine' }).then(curs => curs.toArray());
        expect(aDocs).toHaveLength(1);
        expect(aDocs[0].id).toBe(5);
    });
    it('find documents among thousands', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c14-giant'));
        c.io = new MemIo();
        await c.init();
        await c.createIndex('name');
        await c.createIndex('age');
        for (let i = 0; i < 2000; ++i) {
            const doc = {
                id: 'xxx' + i,
                name: Math.floor(Math.random() * 1296).toString(36),
                hex: i.toString(16),
                age: Math.floor(Math.random() * 100)
            };
            await c.save(doc);
        }
        await c.save({
            id: 'xxx2001',
            name: 'zoltec-le-sorcier',
            hex: (2001).toString(16),
            age: 33
        });
        for (let i = 2002; i < 3000; ++i) {
            const doc = {
                id: 'xxx' + i,
                name: Math.floor(Math.random() * 1296).toString(36),
                hex: i.toString(16),
                age: Math.floor(Math.random() * 100)
            };
            await c.save(doc);
        }
        const docZoltec = await c.find({ name: 'zoltec-le-sorcier' }).then(curs => curs.toArray());
        expect(docZoltec).toHaveLength(1);
        expect(docZoltec[0].id).toBe('xxx2001');
        expect(docZoltec[0].name).toBe('zoltec-le-sorcier');
        expect(c.index.search('name', 'zoltec-le-sorcier')).toEqual(['xxx2001']);
        await c.remove('xxx2001');
        expect(c.index.data.has('name')).toBeTruthy();
        expect(c.index.data.get('name')).toBeInstanceOf(DbIndex);
        expect(c.index.data.get('name').values.has('zoltec-le-sorcier')).toBeFalsy();
        expect(c.index.search('name', 'zoltec-le-sorcier')).toBeNull();
        const docZoltec2 = await c.find({ name: 'zoltec-le-sorcier' }).then(curs => curs.toArray());
        expect(docZoltec2).toHaveLength(0);
    });
    it('finds a document with lots of properties', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c15'));
        c.io = new MemIo();
        await c.init();
        await c.createIndex('a');
        await c.createIndex('b');
        await c.createIndex('c');
        await c.save({
            id: 1,
            a: 'abc',
            b: 'bcd',
            c: 'cde',
            d: 'def',
            e: 'efg',
            f: 'fgh'
        });
        await c.save({
            id: 2,
            a: 'abc',
            b: 'bcd',
            c: 'xx1',
            d: 'xx2',
            e: 'xx3',
            f: 'xx4'
        });
        await c.save({
            id: 3,
            a: 'abc',
            b: 'xx1',
            c: 'cde',
            d: 'xx2',
            e: 'xx3',
            f: 'xx4'
        });
        const x = c._getIndexedKeys({ a: 'abc', b: 'bcd' });
        expect(x).toEqual(['1', '2']);
        const d = await c.find({ a: 'abc', b: 'bcd', f: 'xx4' }).then(curs => curs.toArray());
        expect(d).toHaveLength(1);
        expect(d[0].id).toBe(2);
        const d2 = await c.find({ b: 'xx1', c: 'xx1' }).then(curs => curs.toArray());
        expect(d2).toHaveLength(0);
    });
    it('check if null values are indexed', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c16'));
        c.io = new MemIo();
        await c.init();
        await c.createIndex('nullableField');
        await c.save({
            id: 1,
            nullableField: 'aaaaaaaaaa'
        });
        await c.save({
            id: 2,
            nullableField: 'bbbbbbbbbbbbb'
        });
        await c.save({
            id: 3,
            nullableField: 'cccccccccc'
        });
        await c.save({
            id: 4,
            nullableField: null
        });
        await c.save({
            id: 5,
            nullableField: 'ddddddddddddddd'
        });
        await c.save({
            id: 6,
            nullableField: null
        });
        const d1 = await c.find({ nullableField: 'aaaaaaaaaa' }).then(curs => curs.toArray());
        expect(d1).toHaveLength(1);
        expect(d1[0].id).toBe(1);
        const d2 = await c.find({ nullableField: null }).then(curs => curs.toArray());
        expect(d2).toHaveLength(2);
        expect(d2[0].id).toBe(4);
        expect(d2[1].id).toBe(6);
    });
    it('test indexed value with predicate', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c17'));
        c.io = new MemIo();
        await c.init();
        await c.createIndex('intval1');
        for (let i = 0; i < 20; ++i) {
            const d = {
                id: 10 + i,
                intval1: i
            };
            await c.save(d);
        }
        const dx = c.index._searchValues('intval1', x => parseInt(x) < 10);
        dx.sort((a, b) => parseInt(a) - parseInt(b));
        expect(dx).toEqual(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']);
    });
    it('test indexed value with operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c18'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        await c.createIndex('element');
        const d1 = await c.find({ element: { $in: ['fire', 'ice'] } }).then(curs => curs.toArray());
        d1.sort((a, b) => a.id - b.id);
        expect(d1).toEqual([
            { id: 1, name: 'ifrit', element: 'fire' },
            { id: 2, name: 'shiva', element: 'ice' }
        ]);
        const d2 = await c.find({ element: { $nin: ['fire', 'ice', 'water', '', 'divine', 'light', 'shadow'] } }).then(curs => curs.toArray());
        d2.sort((a, b) => a.id - b.id);
        expect(d2).toEqual([
            { id: 3, name: 'ramuh', element: 'thunder' },
            { id: 7, name: 'ixion', element: 'thunder' },
            { id: 8, name: 'titan', element: 'earth' }
        ]);
    });
    it('test non-indexed value with operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c19'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const d1 = await c.find({ element: { $in: ['fire', 'ice'] } }).then(curs => curs.toArray());
        d1.sort((a, b) => a.id - b.id);
        expect(d1).toEqual([
            { id: 1, name: 'ifrit', element: 'fire' },
            { id: 2, name: 'shiva', element: 'ice' }
        ]);
        const d2 = await c.find({ element: { $nin: ['fire', 'ice', 'water', '', 'divine', 'light', 'shadow'] } }).then(curs => curs.toArray());
        d2.sort((a, b) => a.id - b.id);
        expect(d2).toEqual([
            { id: 3, name: 'ramuh', element: 'thunder' },
            { id: 7, name: 'ixion', element: 'thunder' },
            { id: 8, name: 'titan', element: 'earth' }
        ]);
    });
    it('test non-indexed value with mod operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c20'));
        c.io = new MemIo();
        await c.init();
        await c.save({ id: 1, value: 1 });
        await c.save({ id: 2, value: 2 });
        await c.save({ id: 3, value: 3 });
        await c.save({ id: 4, value: 4 });
        await c.save({ id: 5, value: 5 });
        await c.save({ id: 6, value: 6 });
        await c.save({ id: 7, value: 7 });
        await c.save({ id: 8, value: 8 });
        await c.save({ id: 9, value: 9 });
        expect(await c.find({ value: { $mod: [2, 0] } }).then(curs => curs.toArray())).toEqual([
            { id: 2, value: 2 },
            { id: 4, value: 4 },
            { id: 6, value: 6 },
            { id: 8, value: 8 }
        ]);
        expect(await c.find({ value: { $mod: [2, 1] } }).then(curs => curs.toArray())).toEqual([
            { id: 1, value: 1 },
            { id: 3, value: 3 },
            { id: 5, value: 5 },
            { id: 7, value: 7 },
            { id: 9, value: 9 }
        ]);
    });
    it('test non-indexed value with exists operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c21'));
        c.io = new MemIo();
        await c.init();
        await c.save({ id: 1, value: 1 });
        await c.save({ id: 2, value: 2 });
        await c.save({ id: 3, value: 'abc' });
        await c.save({ id: 4, value: 4 });
        await c.save({ id: 5, value: 5 });
        await c.save({ id: 6, value: 6 });
        await c.save({ id: 7, value: 'def' });
        await c.save({ id: 8, value: 8 });
        await c.save({ id: 9, value: 9 });
        expect(await c.find({ value: { $type: 'string' } }).then(curs => curs.toArray())).toEqual([
            { id: 3, value: 'abc' },
            { id: 7, value: 'def' }
        ]);
    });
    it('test non-indexed value with exists operator 1', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c22'));
        c.io = new MemIo();
        await c.init();
        await c.save({ id: 1, value: 1 });
        await c.save({ id: 2, value: 2 });
        await c.save({ id: 3, value: 'abc', truc: 1 });
        await c.save({ id: 4, value: 4 });
        await c.save({ id: 5, value: 5 });
        await c.save({ id: 6, value: 6 });
        await c.save({ id: 7, value: 'def' });
        await c.save({ id: 8 });
        await c.save({ id: 9, value: 9 });
        expect(await c.find({ truc: { $exists: true } }).then(curs => curs.toArray())).toEqual([
            { id: 3, value: 'abc', truc: 1 }
        ]);
        expect(await c.find({ value: { $exists: false } }).then(curs => curs.toArray())).toEqual([
            { id: 8 }
        ]);
    });
    it('test non-indexed value with regexp operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c23'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);

        const curs1 = await c.find({ name: { $match: /amu/ } });
        const d1 = await curs1.toArray();
        const names1 = d1.map(({ name }) => name);
        expect(names1.includes('ramuh')).toBeTruthy();
        expect(names1.includes('bahamut')).toBeTruthy();
        expect(names1).toHaveLength(2);
        await c.save({
            id: 50,
            name: 'musashi',
            element: ''
        });
        const curs2 = await c.find({ name: /SHI/i });
        const d2 = await curs2.toArray();
        const names2 = d2.map(({ name }) => name);
        expect(names2.includes('shiva')).toBeTruthy();
        expect(names2.includes('musashi')).toBeTruthy();
        expect(names2).toHaveLength(2);
    });
    it('test indexed value with regexp operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c23'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        await c.createIndex('name');

        const curs1 = await c.find({ name: { $match: /amu/ } });
        const d1 = await curs1.toArray();
        const names1 = d1.map(({ name }) => name);
        expect(names1.includes('ramuh')).toBeTruthy();
        expect(names1.includes('bahamut')).toBeTruthy();
        expect(names1).toHaveLength(2);
        await c.save({
            id: 50,
            name: 'musashi',
            element: ''
        });
        const curs2 = await c.find({ name: /SHI/i });
        const d2 = await curs2.toArray();
        const names2 = d2.map(({ name }) => name);
        expect(names2.includes('shiva')).toBeTruthy();
        expect(names2.includes('musashi')).toBeTruthy();
        expect(names2).toHaveLength(2);
    });
    it('test non-indexed value with arrayed regexp operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c23'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);

        const curs1 = await c.find({ name: { $in: [/amu/, 'shiva'] } });
        const d1 = await curs1.toArray();
        const names1 = d1.map(({ name }) => name);
        expect(names1.includes('shiva')).toBeTruthy();
        expect(names1.includes('ramuh')).toBeTruthy();
        expect(names1.includes('bahamut')).toBeTruthy();
        expect(names1).toHaveLength(3);
    });
    it('test indexed value with arrayed regexp operator', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c23'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        await c.createIndex('name');

        const curs1 = await c.find({ name: { $in: [/amu/, 'shiva'] } });
        const d1 = await curs1.toArray();
        const names1 = d1.map(({ name }) => name);
        expect(names1.includes('shiva')).toBeTruthy();
        expect(names1.includes('ramuh')).toBeTruthy();
        expect(names1.includes('bahamut')).toBeTruthy();
        expect(names1).toHaveLength(3);
    });
});

describe('custom operator', function () {
    it('a simple get length string function', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c19'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        db.operators.$maxlen = operand => value => value.length <= parseInt(operand);
        const d = await c.find({ name: { $maxlen: 4 } });
        expect((await d.first()).name).toBe('odin');
        expect(d.count).toBe(1);
    });
});

describe('case insensitive index', function () {
    it('index must return id', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c20'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        const d1 = await c.find({ name: 'SHIVA' });
        expect(d1.count).toBe(0);
        const d2 = await c.find({ name: { $eq: 'SHIVA' } });
        expect(d2.count).toBe(1);
        await c.createIndex('name', {
            caseInsensitive: true,
            unique: true
        });
        const s1 = c.index.search('name', 'shiva');
        expect(s1).toEqual(['2']);
        const s2 = c.index.search('name', 'SHIVA');
        expect(s2).toEqual(['2']);
    });
});

describe('hashed index', function () {
    it('search for indexed hashed value crc32', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c21'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        c.index._DEBUG = true;
        await c.createIndex('name', {
            unique: false,
            caseInsensitive: true,
            type: db.INDEX_TYPES
        });
        const s1 = c.index.search('name', 'shiva');
        expect(s1).toEqual(['2']);
        const s2 = c.index.search('name', 'SHIVA');
        expect(s2).toEqual(['2']);
    });
    it('search for indexed hashed value crc16', async function () {
        const c = new db.Collection(path.join(TMP_DIR, 'c22'));
        c.io = new MemIo();
        await c.init();
        await seedData(c);
        c.index._DEBUG = true;
        await c.createIndex('name', {
            unique: false,
            caseInsensitive: true,
            type: INDEX_TYPES.CRC16
        });
        const s1 = c.index.search('name', 'shiva');
        expect(s1).toEqual(['2']);
        const s2 = c.index.search('name', 'SHIVA');
        expect(s2).toEqual(['2']);
    });
});
