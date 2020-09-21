import LightMap from "../libs/light-sources/LightMap";


describe('#light-sources', function() {
    describe('basic', function () {
        it('should instanciate', function () {
            const lm = new LightMap();
            lm.setSize(40, 35);
            expect(lm._grid.width).toBe(40);
        });
    });
    describe('light blocking', function () {
        it('should have 4 light blocker', function () {
            const lm = new LightMap();
            lm.setSize(40, 35);
            lm.setLightBlocking(20, 10, 2, 2, true);
            const a = [];
            lm._lb.iterate((x, y) => a.push('[' + x + ';' + y + ']'));
            expect(a.join('')).toBe('[20;10][21;10][20;11][21;11]');
            lm.setLightBlocking(20, 10, 1, 1, false);
            const b = [];
            lm._lb.iterate((x, y) => b.push('[' + x + ';' + y + ']'));
            expect(b.join('')).toBe('[21;10][20;11][21;11]');
        });
    });
    describe('update pixel', function () {
        it('should mark one pixel', function () {
            const lm = new LightMap();
            lm.setSize(40, 35);
            lm.updatePixel(10, 15, 0.5, 1);
            expect(lm._grid.cell(10, 15).length).toBe(1);
            expect(lm._grid.cell(10, 15)[0]).toEqual({v: 0.5, i: true, id: 1, s: 2});
            expect(lm._gu.isMarked(10, 14)).toBeTruthy();
            expect(lm._gu.isMarked(10, 15)).toBeFalsy();
        });
        it('should remove pixel', function () {
            const lm = new LightMap();
            lm.setSize(40, 35);
            lm.updatePixel(10, 15, 0.5, 1);
            expect(lm._grid.cell(10, 15).length).toBe(1);
            lm.removePixel(10, 15, 1);
            expect(lm._gu.isMarked(10, 14)).toBeTruthy();
            expect(lm._gu.isMarked(10, 15)).toBeFalsy();
        });
    });
    describe('adding source', function () {
        it('should add a source', function() {
            const lm = new LightMap();
            lm.setSize(40, 35);
            const oSource = lm.addSource(10, 12, 4, 8, 0.5);
            expect(lm._sources.length).toBe(1);
            expect(lm._sources[0]).toBe(oSource);
        });
        it('should draw a source', function() {
            const lm = new LightMap();
            lm.setSize(40, 35);
            const oSource = lm.addSource(10, 12, 4, 8, 0.5);
            oSource._id = 10;
            lm.traceAllSources();
            expect(lm._grid.cell(1, 1).length).toBe(0);
            expect(lm._grid.cell(10, 12).length).toBe(1);
            expect(lm._grid.cell(10, 12)[0]).toEqual({v: 0.5, i: true, s: 2, id: 10});
            //lm.filter((x, y, v) => console.log(x, y, v));
        });
    });

    describe('removing source', function () {
        it('should NOT draw a source', function() {
            const lm = new LightMap();
            lm.setSize(40, 35);
            const oSource = lm.addSource(10, 12, 4, 8, 0.5);
            oSource._id = 10;
            lm.traceAllSources();
            expect(lm._grid.cell(1, 1).length).toBe(0);
            expect(lm._grid.cell(10, 12).length).toBe(1);
            expect(lm._grid.cell(10, 12)[0]).toEqual({v: 0.5, i: true, s: 2, id: 10});
            lm.removeSource(oSource);
            expect(lm._grid.cell(10, 12).length).toBe(1);
            expect(lm._grid.cell(10, 12)[0]).toEqual({v: 0, i: true, s: 0, id: 10});
            expect(lm._sources.length).toBe(1);
        });
    });


    describe('testing grid sizes', function() {
        it('simple example', function() {
            const lm = new LightMap();
            lm.setSize(60, 30);
            expect(lm._grid.width).toBe(60);
            const s1 = lm.addSource(2, 1, 10, 20, 1);
            lm.traceAllSources();
            expect(s1.metrics.x).toBe(2);
            expect(s1.metrics.y).toBe(1);
            expect(s1.metrics.r0).toBe(10);
            expect(s1.metrics.r1).toBe(20);
            expect(s1.metrics.v).toBe(1);
        });
    });
});
