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

export const METRIC_CAMERA_DEFAULT_SIZE = 24; // default size for camera entity
export const METRIC_COLLIDER_SECTOR_SIZE = 128; // default size for collider sector

export const SPRITE_DIRECTION_COUNT = 8;

export const COLLISION_CHANNEL_CREATURE = 1;  // collision channel for normal tangible creature
export const COLLISION_CHANNEL_MISSILE = 2;   // collision channel for normal exploding missile of any type

