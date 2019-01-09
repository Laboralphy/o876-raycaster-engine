import Vector from "../geometry/Vector";

class Location {
    constructor({x = 0, y = 0, z = 0, angle = 0, area = null} = {}) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.angle = angle;
        this.area = area;
    }

    set({x = null, y = null, z = null, angle = null, area = null}) {
        if (x !== null) {
            this.x = x;
        }
        if (y !== null) {
            this.y = y;
        }
        if (z !== null) {
            this.z = z;
        }
        if (angle !== null) {
            this.angle = angle;
        }
        if (area !== null) {
            this.area = area;
        }
    }

    /**
     * Returns a vector from the location
     * @return {Vector}
     */
    vector() {
        return new Vector(this.x, this.y);
    }

    /**
     * Returns a position vector of a point in front of the location, at a given distance
     * @param d {number} a given distance
     * @return {Vector}
     */
    front(d) {
        return new Vector(d * Math.cos(this.angle), d * Math.sin(this.angle));
    }
}


export default Location;
