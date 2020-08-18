class RangeCollider {
    constructor(p1 = null, p2 = null) {
        this._p1 = 0;
        this._p2 = 1;
        if (p1 !== null && p2 !== null) {
            this.setRange(p1, p2);
        }
    }

    setRange(p1, p2) {
        if (p1 > p2) {
            throw new Error('invalid range : first param must be lower or equal than second param');
        }
        this._p1 = p1;
        this._p2 = p2;
    }

    getPointSector(x) {
        const p1 = this._p1;
        const p2 = this._p2;
        if (x < p1) {
            return 1;
        }
        if (x > p2) {
            return 3;
        }
        return 2;
    }

    /**
     *
     * @param x1 {number}
     * @param x2 {number}
     * @return {number}
     */
    getRangeSectors(x1, x2) {
        const r1 = this.getPointSector(Math.min(x1, x2));
        const r2 = this.getPointSector(Math.max(x1, x2));
        return r1 * 10 + r2;
    }

    /**
     * Return the size that is outsize the range on the left
     * @param x1
     * @param x2
     */
    getLeftRelic(x1, x2) {
        if (x1 > x2) {
            throw new Error('range is invalid : ' + x1 + ', ' + x2 + ' - first boundary must be lower than second one');
        }
        const rs = this.getRangeSectors(x1, x2);
        switch (rs) {
            case 11:
                return x2 - x1;

            case 12:
            case 13:
                return this._p1 - x1;

            default:
                return 0;
        }
    }

    /**
     * Same as getLeftRelic but for the right boudary
     * @param x1
     * @param x2
     * @return {number}
     */
    getRightRelic(x1, x2) {
        if (x1 > x2) {
            throw new Error('range is invalid : ' + x1 + ', ' + x2 + ' - first boundary must be lower than second one');
        }
        const rs = this.getRangeSectors(x1, x2);
        switch (rs) {
            case 23:
            case 13:
                return x2 - this._p2;

            case 33:
                return x2 - x1;

            default:
                return 0;
        }
    }

    getCenterRelic(x1, x2) {
        if (x1 > x2) {
            throw new Error('range is invalid : ' + x1 + ', ' + x2 + ' - first boundary must be lower than second one');
        }
        const rs = this.getRangeSectors(x1, x2);
        switch (rs) {
            case 12:
                return x2 - this._p1;

            case 22:
                return x2 - x1;

            case 23:
                return this._p2 - x1;

            case 13:
                return this._p2 - this._p1;

            default:
                return 0;
        }
    }

}

export default RangeCollider;