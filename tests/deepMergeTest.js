const deepMerge = require('../src/raycaster/deepMerge').default;

describe('#deepMerge', function() {
    it('should shallow merge', function() {
        let a = {x: 1, y: 2};
        let b = {z: 3};
        expect (deepMerge(a, b)).toEqual({
            x: 1,
            y: 2,
            z: 3
        });
    });
    it('should shallow merge 2', function() {
        let a = {x: 1, y: 2};
        let b = {x: 3};
        expect (deepMerge(a, b)).toEqual({
            x: 3,
            y: 2
        });
    });
    it('should deep merge 2', function() {
        let a = {x: 1, y: {d1: 10, d2: 20, d3: [3,4,5]}};
        let b = {y: {d1: 100, d3: [5]}};
        expect (deepMerge(a, b)).toEqual({
            x: 1,
            y: {
                d1:100,
                d2:20,
                d3: [3,4,5]
            }
        });
    });
    it('should deep merge 3', function() {
        let a = {x: 1, y: {d1: 10, d2: 20, d3: [3,4,5]}};
        let b = {y: {d1: 100, d3: [6]}};
        expect (deepMerge(a, b)).toEqual({
            x: 1,
            y: {
                d1:100,
                d2:20,
                d3: [3,4,5,6]
            }
        });
    });
});