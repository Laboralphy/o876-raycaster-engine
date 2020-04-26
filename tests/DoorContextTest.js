const DoorContext = require('../libs/engine/DoorContext').default;

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
        expect(dc.isDone()).toBeFalsy();
        expect(dc._phase).toBe(3);

        dc.process();
        expect(dc._time).toBe(0);
        expect(dc._phase).toBe(4);
        expect(dc._easing.over()).toBeTruthy();
        expect(dc.isDone()).toBeTruthy();
    });

    it ('should open after a delay', function() {
        const dc = new DoorContext({
            sdur: 10,
            mdur: 20,
            ddur: 4,
            ofsmax: 64
        });
        expect(dc.getState().phase).toBe(0);
        dc.process();
        expect(dc.getState().phase).toBe(0);
        dc.process();
        expect(dc.getState().phase).toBe(0);
        dc.process();
        expect(dc.getState().phase).toBe(0);
        dc.process();
        expect(dc.getState().phase).toBe(1);

    });

    it ('should not close while canceled', function() {
        const dc = new DoorContext({
            sdur: 10,
            mdur: 20,
            ofsmax: 64
        });
        let ENTITY_ON_THE_WAY = true;
        let nTries = 0;
        dc.events.on('check', function(event) {
            ++nTries;
            event.cancel = ENTITY_ON_THE_WAY;
        });

        expect(nTries).toBe(0); // no checked yet
        for (let i = 0; i < 100; ++i) {
            dc.process();
        }
        expect(nTries).not.toBe(0); // has been checked
        expect(dc.getPhase()).toBe(2); // stuck in phase 2
        ENTITY_ON_THE_WAY = false; // remove obstacle
        for (let i = 0; i < 20; ++i) {
            dc.process();
        }
        expect(dc.getPhase()).not.toBe(1); // now in phase 3 or 4
        expect(dc.getPhase()).not.toBe(2); // now in phase 3 or 4
    });

});
