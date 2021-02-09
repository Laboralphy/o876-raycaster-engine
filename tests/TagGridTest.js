const TagGrid = require('../libs/tag-grid').default;

describe('#tags-grid', function() {
    it('should work 1', function() {
        const tg = new TagGrid();
        tg.width = (10);
        tg.height = (10);
        let id = tg.addTag(0, 0, 'the first tags');
        expect(id).toBe(1);
        expect(tg.cell(0, 0)).toEqual(new Set([1]));
    });

    it('should work 2', function() {
        const tg = new TagGrid();
        tg.width = (10);
        tg.height = (10);
        let id1 = tg.addTag(4, 0, 'the first tags');
        let id2 = tg.addTag(4, 0, 'the second tags');
        expect(id1).toBe(1);
        expect(id2).toBe(2);
        expect(tg.cell(4, 0)).toEqual(new Set([1, 2]));
        let id3 = tg.addTag(4, 0, 'the second tags');
        expect(id3).toBe(2);
        expect(tg.cell(4, 0)).toEqual(new Set([1, 2]));
        tg.removeTag(4, 0, 1);
        expect(tg.cell(4, 0)).toEqual(new Set([2]));
    });

    it('should visit', function() {
        const tg = new TagGrid();
        tg.width = (10);
        tg.height = (10);
        tg.addTag(0, 0, '111');
        tg.addTag(0, 0, '222'); // 111 222

        tg.addTag(1, 0, '222'); //     222

        tg.addTag(2, 0, '333'); //         333
        expect(tg.visit(0, 0, 1, 0)).toEqual({
            'new': new Set(),
            'old': new Set([1])
        });
        expect(tg.visit(1, 0, 2, 0)).toEqual({
            'new': new Set([3]),
            'old': new Set([2])
        });
        expect(tg.visit(2, 0, 2, 1)).toEqual({
            'new': new Set(),
            'old': new Set([3])
        });
        expect(tg.visit(2, 1, 2, 1)).toBeFalsy();
    });

    it('should build a tag list', function() {
        const tg = new TagGrid();
        tg.width = 10;
        tg.height = 10;
        tg.addTag(0, 0, 't111');
        tg.addTag(0, 0, 't222 "cy z"'); // 111 222
        tg.addTag(1, 0, 't222'); //     222
        tg.addTag(2, 0, 't333'); //         333
        expect(tg.getCellTags(0, 0)).toEqual([{id: 1, x: 0, y: 0, tag: ['t111']}, {id: 2, x: 0, y: 0, tag: ['t222', 'cy z']}]);
    });

    it('should properly get and set states', function() {
        const tg = new TagGrid();
        tg.width = 10;
        tg.height = 10;
        const id1 = tg.addTag(5, 2, 't111');
        const id2 = tg.addTag(6, 2, 't222 "cy z"');
        const id3 = tg.addTag(7, 4, 't222');
        const id4 = tg.addTag(8, 4, 't333');
        const id5 = tg.addTag(6, 2, 't444 10 80 90');
        const oState = tg.state;
        const tg2 = new TagGrid();
        tg2.state = oState;
        expect(tg2.width).toBe(10);
        expect(tg2.height).toBe(10);
        expect(tg2.getTag(id1)).toBe('t111');
        expect(tg2.getTag(id2)).toBe('t222 "cy z"');
        expect(tg2.getTag(id3)).toBe('t222');
        expect(tg2.getTag(id4)).toBe('t333');
        expect(tg2.getTag(id5)).toBe('t444 10 80 90');
        const id6 = tg2.addTag(2, 2, 't555 xxx');
        expect(id6).not.toBe(id1);
        expect(id6).not.toBe(id2);
        expect(id6).not.toBe(id3);
        expect(id6).not.toBe(id4);
        expect(id6).not.toBe(id5);
    });
});
