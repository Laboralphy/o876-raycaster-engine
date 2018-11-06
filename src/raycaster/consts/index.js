
// Laby Phys Properties

export const PHYS_NONE = 0x00;
export const PHYS_WALL = 0x01;
export const PHYS_FIRST_DOOR = 0x02;
export const PHYS_DOOR_SLIDING_UP = 0x02;
export const PHYS_CURT_SLIDING_UP = 0x03;
export const PHYS_DOOR_SLIDING_DOWN = 0x04;
export const PHYS_CURT_SLIDING_DOWN = 0x05;
export const PHYS_DOOR_SLIDING_LEFT = 0x06;
export const PHYS_DOOR_SLIDING_RIGHT = 0x07;
export const PHYS_DOOR_SLIDING_DOUBLE = 0x08;
export const PHYS_LAST_DOOR = 0x08;
export const PHYS_SECRET_BLOCK = 0x09;
export const PHYS_TRANSPARENT_BLOCK = 0x0A;
export const PHYS_INVISIBLE_BLOCK = 0x0B;
export const PHYS_OFFSET_BLOCK = 0x0C;
export const PHYS_DOOR_D = 0x0D;
export const PHYS_DOOR_E = 0x0E;
export const PHYS_DOOR_F = 0x0F;



export const FACE_WEST = 0;
export const FACE_SOUTH = 1;
export const FACE_EAST = 2;
export const FACE_NORTH = 3;
export const FACE_FLOOR = 4;
export const FACE_CEILING = 5;

/**
 * loop code for "no loop", this is an unanimated animation
 * @type {number}
 */
export const ANIM_LOOP_NONE = 0;

/**
 * loop code for "forward" : this animation is going forward only
 * @type {number}
 */
export const ANIM_LOOP_FORWARD = 1;

/**
 * loop code for "back and forth" animation : this animation continually goes from forth to back
 * @type {number}
 */
export const ANIM_LOOP_YOYO = 2;





/**
 * No effect assigned to the sprite
 * @type {number}
 */
export const FX_NONE = 0;

/**
 * The sprite will be translucent with an "add" composite drawing operation
 * @type {number}
 */
export const FX_LIGHT_ADD = 1;

/**
 * The sprite is a light source; and will not be drawn darker when far from player's point of view
 * @type {number}
 */
export const FX_LIGHT_SOURCE = 2;			// Le sprite ne devien pas plus sombre lorsqu'il s'éloigne de la camera

/**
 * The sprite opacity is 75%
 * @type {number}
 */
export const FX_ALPHA_75 = 1 << 2;

/**
 * The sprite opacity is 50%
 * @type {number}
 */
export const FX_ALPHA_50 = 2 << 2;

/**
 * The sprite opacity is 25%; hardly visible
 * @type {number}
 */
export const FX_ALPHA_25 = 3 << 2;

/**
 * Undocumented. Used for optimisation.
 * @type {number}
 */
export const FX_DIM0 = 0x10;

/**
 * This array is internally used by the framework
 * @type {number[]}
 */
export const FX_ALPHA = [1, 0.75, 0.50, 0.25, 0];
