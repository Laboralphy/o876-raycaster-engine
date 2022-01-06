const quoteSplit = require('../libs/quote-split')

describe('testing simple', function () {
    it('t1', function () {
        const s = 't222 "cy z"'
        expect(quoteSplit(s)).toEqual(['t222', 'cy z'])
    })
})