import Painting from "../src/painting-algorithm";

describe('#Painting', function() {
    describe('basic', function() {
        it('should work 1', function() {
            const a = [
                ('*********').split(''),
                ('*   *   *').split(''),
                ('*   *   *').split(''),
                ('*  *    *').split(''),
                ('***   ***').split(''),
                ('*    *  *').split(''),
                ('*   *   *').split(''),
                ('*   *   *').split(''),
                ('*********').split('')
            ];
            const aList = Painting.paint(4, 4, (x, y) => {
                if (x >= 0 && y >= 0 && x < a[0].length && y < a.length) {
                    return a[y][x] === ' ';
                } else {
                    return false;
                }
            });
            aList.forEach(({x, y}) => {
                a[y][x] = 'X';
            });

            expect(a.map(r => r.join(''))).toEqual([
                ('*********'),
                ('*   *XXX*'),
                ('*   *XXX*'),
                ('*  *XXXX*'),
                ('***XXX***'),
                ('*XXXX*  *'),
                ('*XXX*   *'),
                ('*XXX*   *'),
                ('*********')
            ]);
        });

        it('should work 2', function() {
            const a = [
                ('*********').split(''),
                ('*   *   *').split(''),
                ('*   *   *').split(''),
                ('*       *').split(''),
                ('***   ***').split(''),
                ('*    *  *').split(''),
                ('*   *   *').split(''),
                ('*   *   *').split(''),
                ('*********').split('')
            ];
            const aList = Painting.paint(1, 1, (x, y) => {
                if (x >= 0 && y >= 0 && x < a[0].length && y < a.length) {
                    return a[y][x] === ' ';
                } else {
                    return false;
                }
            });
            aList.forEach(({x, y}) => {
                a[y][x] = 'X';
            });

            expect(a.map(r => r.join(''))).toEqual([
                ('*********'),
                ('*XXX*XXX*'),
                ('*XXX*XXX*'),
                ('*XXXXXXX*'),
                ('***XXX***'),
                ('*XXXX*  *'),
                ('*XXX*   *'),
                ('*XXX*   *'),
                ('*********')
            ]);
        });

        it('should work 3', function() {
            const a = [
                ('*********').split(''),
                ('*   *   *').split(''),
                ('*   *   *').split(''),
                ('*       *').split(''),
                ('***   ***').split(''),
                ('*    *  *').split(''),
                ('*   *   *').split(''),
                ('*   *   *').split(''),
                ('*********').split('')
            ];
            Painting.paint(1, 1, (x, y) => {
                if (x >= 0 && y >= 0 && x < a[0].length && y < a.length) {
                    if (a[y][x] === ' ') {
                        a[y][x] = '+';
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            });

            expect(a.map(r => r.join(''))).toEqual([
                ('*********'),
                ('*+++*+++*'),
                ('*+++*+++*'),
                ('*+++++++*'),
                ('***+++***'),
                ('*++++*  *'),
                ('*+++*   *'),
                ('*+++*   *'),
                ('*********')
            ]);
        });
    });
});