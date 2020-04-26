import MarkerRegistry from "../marker-registry";


/**
 * This is a simple implementation of the painting algorithm
 */
class Painting {

    /**
     * Paints an abstract surface. The pTest function is provided in order to tell if the current observed pixel
     * is of the same "color" as the starting pixel at xStaert, yStart.
     * @param xStart {number} starting position (x axis)
     * @param yStart {number} starting position (y axis)
     * @param pTest {function(x, y)} the testing function, receive x y as the current pixel position, must return true of false
     * @param aResult
     * @return {Array}
     */
    static paint(xStart, yStart, pTest, aResult = []) {

        const m = new MarkerRegistry();

        // initial state of the stack
        const aStack = [];

        /**
         * Push x y on top of the stack
         * @param x
         * @param y
         */
        const pushStack = (x, y) => {
            aStack.push({x, y});
        };

        /**
         * Push x y on top of the result stack
         * @param x
         * @param y
         */
        const pushResult = (x, y) => {
            aResult.push({x, y});
            m.mark(x, y);
        };

        /**
         * if this item pass the test, then it is pushed on the result stack
         * @param x
         * @param y
         */
        const tryPixel = (x, y) => {
            if (m.isMarked(x, y)) {
                return false;
            }
            if (pTest(x, y)) {
                pushStack(x, y);
                return true;
            }
            return false;
        };

        // first pixel fail ? end of function
        if (tryPixel(xStart, yStart)) {
            pushStack(xStart, yStart);
        } else {
            return aResult;
        }

        while(aStack.length > 0) {
            const p = aStack.pop();
            pushResult(p.x, p.y);
            tryPixel(p.x, p.y - 1);
            tryPixel(p.x, p.y + 1);
            tryPixel(p.x + 1, p.y);
            tryPixel(p.x - 1, p.y);
        }
        return aResult;
    }
}

export default Painting;