/**
 * Functions concerning angles and distances
 */



/**
 * Distance between 2 points
 * @param x1 {Number} point 1 coordinates
 * @param y1 {Number}
 * @param x2 {Number} point 2 coordinates
 * @param y2 {Number}
 * @return {number} distance
 */
export function distance(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Renvoie true si le point est dans le rectangle
 * @param x {number} coordonnée du point
 * @param y {number} coordonnée du point
 * @param xr {number} coordonnée du rect
 * @param yr {number} coordonnée du rect
 * @param wr {number} largeur du rect
 * @param hr {number} hauteur du rect
 * @return {boolean}
 */
export function pointInRect(x, y, xr, yr, wr, hr) {
    return x >= xr && y >= yr && x < xr + wr && y < yr + hr;
}

export function rectInRect(ax, ay, aw, ah, bx, by, bw, bh) {
    let ax2 = ax + aw - 1;
    let ay2 = ay + ah - 1;
    let bx2 = bx + bw - 1;
    let by2 = by + bh - 1;
    return ax < bx2 && ax2 > bx &&
        ay > by2 && ay2 < by;
}

/**
 * Renvoie l'ange que fait la doite x1, y1, x2, y2
 * avec l'axe des X+
 * @param x1 {number}
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @return {number}
 */
export function angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * A partir d'un angle et d'une norme, calcule deux composant d'un référentiel rectangulaire
 * @param angle
 * @param norm
 */
export function polar2rect(angle, norm) {
    return {dx: norm * Math.cos(angle), dy: norm * Math.sin(angle)};
}