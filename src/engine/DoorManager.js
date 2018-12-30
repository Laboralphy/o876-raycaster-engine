import DoorContext from "./DoorContext";
import * as RC_CONSTS from "../raycaster/consts/index";



class DoorManager {

    constructor() {
        this._doors = [];
    }

    /**
     * Get the door context related to a position.
     * If a door context is not present, returns undefined
     * @param x {number} door position x
     * @param y {number} door position y
     * @returns {DoorContext}
     */
    getDoorContext(x, y) {
        return this._doors.find(d => d.x === x && d.y === y);
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