/**
 * Created by ralphy on 04/09/17.
 */
import Helper from './Helper';

class Point {
	constructor(x, y) {
		if (typeof x === 'object' && ('x' in x) && ('y' in x)) {
			this.x = x.x;
			this.y = x.y;
		} else {
            this.x = x;
            this.y = y;
		}
	}

	/**
	 * return the distance between this point and the given point
	 * @param p {Point}
	 * @return {number}
	 */
	distance(p) {
		return Helper.distance(p.x, p.y, this.x, this.y);
	}
}

export default Point;