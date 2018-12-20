import DoorContext from "./DoorContext";


class DoorManager {

    constructor() {
        this._doors = [];
    }

    /**
     * Open a doors
     */
    openDoor(x, y, nLimit, nAutoClose) {
        const context = new DoorContext();
        const ds = {
            context,
            x, y,

        };

        ds.x = x;
        ds.y = y;
        ds.phase = PHASE_DOOR_CLOSE;
        //ds.timeLimit =
    }
}