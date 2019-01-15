const LightSource = require("../src/light-sources/LightSource").default;

describe('#LightSource', function() {
    describe('basic', function() {
        it('should be initialized', function() {
            const ls = new LightSource();
            expect(ls instanceof LightSource).toBeTruthy();
        });
    });

    describe('createGridSize', function() {
        it('should be initialized', function() {
            const ls = new LightSource();
            ls._radius0 = 50;
            ls._radius1 = 100;
            ls._createGrid();
            expect(ls._grid.getWidth()).toBe(26);
            expect(ls._grid.getHeight()).toBe(26);
            expect(ls._xCenter).toBe(26);
        });
    });


    describe('createGridSize11', function() {
        it('should be initialized', function() {
            const ls = new LightSource();
            ls._planeSpacing = 64;
            ls._cellSize = 64;
            ls._radius0 = 5;
            ls._radius1 = 10;
            ls._createGrid();
            expect(ls._grid.getWidth()).toBe(21);
            expect(ls._grid.getHeight()).toBe(21);
            expect(ls._xCenter).toBe(21);
        });

        it('should be initialized', function() {
            const ls = new LightSource();
            ls._planeSpacing = 64;
            ls._cellSize = 32;
            ls._radius0 = 5;
            ls._radius1 = 10;
            ls._createGrid();
            expect(ls._grid.getWidth()).toBe(11);
            expect(ls._grid.getHeight()).toBe(11);
            expect(ls._xCenter).toBe(11);
        });
    });



});
