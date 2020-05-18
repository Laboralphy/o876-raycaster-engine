const Animation = require('../src/libs/raycaster/TileAnimation').default;

describe('#TileAnimation', function() {
    it ('should animate', function() {
        const a = new Animation();
        a.count = 4;
        a.duration = 100;
        a.loop = 1;
        expect(a.index).toBe(0);
        expect(a.time).toBe(0);
        a.animate(45);
        expect(a.index).toBe(0);
        expect(a.time).toBe(45);
        a.animate(45);
        expect(a.index).toBe(0);
        expect(a.time).toBe(90);
        a.animate(45);
        expect(a.index).toBe(1);
        expect(a.time).toBe(35);
        a.animate(200);
        expect(a.index).toBe(3);
        expect(a.time).toBe(35);
        a.animate(100);
        expect(a.index).toBe(0);
        expect(a.time).toBe(35);
    })
});
