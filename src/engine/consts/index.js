// used with forEachNeighbor function
export const CELL_NEIGHBOR_SIDE = 1;        // selects cells that share a common side with a given cell
export const CELL_NEIGHBOR_CORNER = 2;      // selects cells that share a common corner with a given cell
export const CELL_NEIGHBOR_SELF = 4;        // selects the cell itself

// Door phases identifier
export const DOOR_PHASE_CLOSE = 0;          // initial state : door is closed and not openned yet
export const DOOR_PHASE_OPENING = 1;        // door is opening
export const DOOR_PHASE_OPEN = 2;           // door is totaly open, the cell become walkable
export const DOOR_PHASE_CLOSING = 3;        // door is closing, the cell is unwalkable
export const DOOR_PHASE_DONE = 4;           // door has finished closing and the context must be reinitialized

// Door open/close times
export const DOOR_SLIDING_DURATION = 24;
export const DOOR_MAINTAIN_DURATION = 300;
export const DOOR_SECURITY_INTERVAL = 10;   // interval of entity presence checking during "CLOSING" phase

