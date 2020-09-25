const SERIAL_VERSION = 1;

class Serializer {

    static censor(key, value) {
        return value === Infinity  ? "Infinity" : value;
    }

    static uncensor(key, value) {
        return value === "Infinity"  ? Infinity : value;
    }

    static getDoorManagerState(g) {
        const engine = g.engine;
        const dm = engine._dm;
        // list all door contexts
        return dm
            .doors
            .map(dc => {
                const dcState = dc.getState();
                return {
                    x: dc.data.x,
                    y: dc.data.y,
                    autoclose: dc.data.autoclose,
                    phase: dcState.phase,
                    time: dcState.time
                };
            });
    }

    static setDoorManagerState(g, state) {
        const engine = g.engine;
        state.forEach(({
            x,
            y,
            autoclose,
            phase,
            time
        }) => {
            engine.openDoor(x, y, autoclose);
            const dc = engine._dm.getDoorContext(x, y);
            dc.setState({phase, time});
        });
    }


    static getDecalState(g) {
        return g._mutations.decals.slice(0);
    }

    /**
     * This function should only be used right after loading level.
     * @param state
     */
    static setDecalState(g, state) {
        g._mutations.decals = [];
        state.forEach(data => {
            switch (data.op) {
                case 'del':
                    g.removeDecals(data.x, data.y, data.sides);
                    break;

                case 'rot':
                    g.rotateDecals(data.x, data.y, data.cw);
                    break;

                case 'app':
                    g.applyDecal(data.x, data.y, data.side, data.ref);
                    break;
            }
        });
    }

    static getPlayerState(g) {
        const oState = {};
        oState.x = g.player.position.x;
        oState.y = g.player.position.y;
        oState.angle = g.player.position.angle;
        return oState;
    }

    static setPlayerState(g, state) {
        g.player.position.set({
            x: state.x,
            y: state.y,
            angle: state.angle
        });
    }

    static saveLevelState(g) {
        const engine = g.engine;
        const oState = {
            version: SERIAL_VERSION,
            type: 'level',
            level: g._mutations.level,
            doors: Serializer.getDoorManagerState(g),
            time: engine._time,
            locks: engine._locks.state,
            decals: Serializer.getDecalState(g),
            tags: engine.tagManager.grid.state,
            senses: g._senseMap.state,
            player: Serializer.getPlayerState(g)
        };
        return JSON.stringify(oState, Serializer.censor);
    }

    static async restoreLevelState(g, state) {
        const oState = JSON.parse(state, Serializer.uncensor);
        if (oState.version !== SERIAL_VERSION) {
            throw new Error('unexpected version number while restoring game state - expected v' + SERIAL_VERSION + ' - got v' + oState.version);
        }
        if (oState.type !== 'level') {
            throw new Error('unexpected state type while restoring game state - expected "level" - got "' + oState.type + '"');
        }
        const engine = g.engine;
        g.exitUI();
        await g.loadLevel(oState.level);
        Serializer.setDoorManagerState(g, oState.doors);
        Serializer.setDecalState(g, oState.decals);
        engine.tagManager.grid.state = oState.tags;
        engine._time = oState.time;
        engine._locks.state = oState.locks;
        g._senseMap.state = oState.senses;
        Serializer.setPlayerState(g, oState.player);
        // g.logic.commit('SET_STATE_CONTENT', {content: oState.logic});
        // g.album.commit('SET_STATE_CONTENT', {content: oState.album});
    }

    static restoreAlbumLogicState(g, oState) {
        g.logic.commit('SET_STATE_CONTENT', {content: oState.logic});
        g.album.commit('SET_STATE_CONTENT', {content: oState.album});
    }

    static saveAlbumLogicState(g) {
        return {
            logic: g.logic.prop('getStateContent'),
            album: g.album.prop('getStateContent')
        };
    }

    //
    // static saveState(g) {
    //     const engine = g.engine;
    //     const oState = {
    //         version: SERIAL_VERSION,
    //         level: g._mutations.level,
    //         doors: Serializer.getDoorManagerState(g),
    //         time: engine._time,
    //         locks: engine._locks.state,
    //         decals: Serializer.getDecalState(g),
    //         tags: engine.tagManager.grid.state,
    //         senses: g._senseMap.state,
    //         logic: g.logic.prop('getStateContent'),
    //         album: g.album.prop('getStateContent'),
    //         player: Serializer.getPlayerState(g)
    //     };
    //     return JSON.stringify(oState, Serializer.censor);
    // }
    //
    // static async restoreState(g, state) {
    //     const oState = JSON.parse(state, Serializer.uncensor);
    //     console.log('restoring state', oState)
    //     if (oState.version !== SERIAL_VERSION) {
    //         throw new Error('unexpected version number while restoring game state - expected v' + SERIAL_VERSION + ' - got v' + oState.version);
    //     }
    //     const engine = g.engine;
    //     g.exitUI();
    //     await g.loadLevel(oState.level);
    //     Serializer.setPlayerState(g, oState.player);
    //     Serializer.setDoorManagerState(g, oState.doors);
    //     Serializer.setDecalState(g, oState.decals);
    //     engine.tagManager.grid.state = oState.tags;
    //     engine._time = oState.time;
    //     engine._locks.state = oState.locks;
    //     g._senseMap.state = oState.senses;
    //     g.logic.commit('SET_STATE_CONTENT', {content: oState.logic});
    //     g.album.commit('SET_STATE_CONTENT', {content: oState.album});
    // }
}

export default Serializer;