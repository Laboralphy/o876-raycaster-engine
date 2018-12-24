const DoorContext = require('../src/engine/DoorContext').default;

describe('#DoorContext', function() {
    it ('should init 0', function() {
        const dc = new DoorContext({});
        expect(dc.getPhase()).toBe(0);
    });

    it('should compute door sliding', function() {
        const dc = new DoorContext({
            sdur: 10,
            mdur: 20,
            ofsmax: 64
        });
        expect(dc.getState().phase).toBe(0);
        dc.process();
        expect(dc.getState().phase).toBe(1);
        expect(dc.getState().time).toBe(0);
        dc.process();
        expect(dc._easing._xMax).toBe(10); // sdur
        expect(dc._easing.over()).toBeFalsy();
        expect(dc.getState().phase).toBe(1);
        expect(dc.getState().time).toBe(1);

        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        expect(dc._easing.over()).toBeFalsy();
        expect(dc.getState().phase).toBe(1);
        expect(dc.getState().time).toBe(9);
        expect(dc._offset).not.toBe(64);

        dc.process();
        expect(dc._offset).toBe(64);
        expect(dc._phase).toBe(2);

        for (let i = 0; i < 19; ++i) {
            dc.process();
        }

        expect(dc._phase).toBe(2);
        dc.process();
        expect(dc._phase).toBe(3);
        expect(dc._offset).toBe(64);
        expect(dc._time).toBe(0);

        dc.process();
        expect(dc._time).toBe(1);

        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        dc.process();
        expect(dc._time).toBe(9);
        expect(dc.isShutDown()).toBeFalsy();
        expect(dc._phase).toBe(3);

        dc.process();
        expect(dc._time).toBe(10);
        expect(dc._phase).toBe(4);
        expect(dc._easing.over()).toBeTruthy();
        expect(dc.isShutDown()).toBeTruthy();

    });
});
