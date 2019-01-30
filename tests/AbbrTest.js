import Abbr from '../src/abbr';

describe('#abbr', function() {
    describe('testing', function() {
        it ('should work', function() {
            const abbr = new Abbr();
            expect(abbr.make('Fonction ornementale de suppression métaphysique des instances obsolètes'))
                .toBe('Fonct. orn. de suppr. mét. des inst. obs.');
        });
    });
});