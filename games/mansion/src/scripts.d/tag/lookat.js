const ANGLE_NORTH = 3 * Math.PI / 2;
const ANGLE_EAST = 0;
const ANGLE_SOUTH = Math.PI / 2;
const ANGLE_WEST = Math.PI;



function getAngle(direction) {
    switch (direction) {
        case 'e':
            return ANGLE_EAST;

        case 's':
            return ANGLE_SOUTH;

        case 'w':
            return ANGLE_WEST;

        case 'n':
            return ANGLE_NORTH;

        default:
            return 0;
    }
}

export function enter(game, remove, x, y, direction) {
    game.player.position.angle = getAngle(direction);
    remove();
}