/**
 * This class implements the bresenham algorithm
 * and extend its use for other purpose than drawing pixel lines
 * good to GIT
 */
class Bresenham {
    /**
     * This function will virtually draw points along a line
     * and will call back a plot function.
     * The line will start at x0, y0 and will end at x1, y1
     * Each time a points is "drawn" a callback is done
     * if the callback returns false, the line function will stop and return false
     * else the line function will return an array of plots
     * @param x0 starting point x
     * @param y0 starting point y
     * @param x1 ending point x
     * @param y1 ending point y
     * @param pCallback a plot function of type function(x, y, n) { return bool; }
     * avec x, y les coordonnées du point et n le numéro duj point
     * @returns {Boolean} false if the fonction has been canceled
     */
    static line(x0, y0, x1, y1, pCallback) {
        x0 |= 0;
        y0 |= 0;
        x1 |= 0;
        y1 |= 0;
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
        let e2;
        let n = 0;
        while (true) {
            if (pCallback) {
                if (pCallback(x0, y0, n) === false) {
                    return false;
                }
            }
            if (x0 === x1 && y0 === y1) {
                break;
            }
            e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
            ++n;
        }
        return true;
    }
}

export default Bresenham;