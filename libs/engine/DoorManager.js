import DoorContext from "./DoorContext";
import * as RC_CONSTS from "../raycaster/consts";



class DoorManager {

    constructor() {
        this._doors = [];
    }

    get state() {
        return this._doors.map(d => {
            const oState = d.state;
            if ('child' in d.data) {
                oState.data.child = this._doors.indexOf(d.data.child);
            }
            return oState;
        });
    }

    set state(value) {
        const doors = [];
        value.forEach(v => {
            const dc = new DoorContext({});
            dc.state = v;
            doors.push(dc);
        });
        doors.forEach(d => {
            if ('child' in d.data) {
                d.data.child = doors[d.data.child];
                if (d.data.child === undefined) {
                    throw new Error('while restoring door manager state : child door context not found');
                }
            }
        })
        this._doors = doors;
    }

    /**
     * Get the door context related to a position.
     * If a door context is not present, returns undefined
     * @param x {number} door position x
     * @param y {number} door position y
     * @returns {DoorContext}
     */
    getDoorContext(x, y) {
        return this._doors.find(d => d.data.x === x && d.data.y === y);
    }

    /**
     * links a new door context in the processing list
     * will overwrite any door context that shares the same x, y
     * @param dc {DoorContext}
     */
    linkDoorContext(dc) {
        const {x, y} = dc.data;
        let odc = null;
        do {
            odc = this.getDoorContext(x, y);
            if (odc) {
                odc.dispose();
            }
        } while (!!odc);
        this._doors.push(dc);
    }

    process() {
        // dcStillWorking : contexts of doors that are still open
        const oResult = this._doors.map(dc => {
            dc.process();
            return {
                x: dc.data.x,
                y: dc.data.y,
                phys: dc.isOpen() ? RC_CONSTS.PHYS_NONE : dc.data.phys,
                offset: dc.offset
            };
        });
        this._doors = this._doors.filter(dc => {
            return !dc.isDone();
        });
        return oResult;
    }
}

export default DoorManager;