const TagGrid = require('../libs/tag-grid').default;

describe('#tags-grid', function() {
    it('should work 1', function() {
        const tg = new TagGrid();
        tg.setWidth(10);
        tg.setHeight(10);
        let id = tg.addTag(0, 0, 'the first tags');
        expect(id).toBe(1);
        expect(tg.cell(0, 0)).toEqual(new Set([1]));
    });

    it('should work 2', function() {
        const tg = new TagGrid();
        tg.setWidth(10);
        tg.setHeight(10);
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
        tg.setWidth(10);
        tg.setHeight(10);
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
        tg.setWidth(10);
        tg.setHeight(10);
        tg.addTag(0, 0, 't111');
        tg.addTag(0, 0, 't222 "cy z"'); // 111 222
        tg.addTag(1, 0, 't222'); //     222
        tg.addTag(2, 0, 't333'); //         333
        expect(tg.getCellTags(0, 0)).toEqual([{x: 0, y: 0, tag: ['t111']}, {x: 0, y: 0, tag: ['t222', 'cy z']}]);
    })
});