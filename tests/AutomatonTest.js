const Automaton = require('../libs/automaton').default;

describe('#automaton', function() {
    it ('testing first state at init', function() {
        const a = new Automaton();
        a.transitions = {
            'a': [
                [1, "b"]
            ],
            "b": [
                ["t_1", "c"],
                ["1", "b"]
            ]
        };
        a.instance = {
            a() {

            },
            b() {

            },
            t_1() {
                return false;
            }
        }
        expect(a.state).toBe('a');
        a.process();
        expect(a.state).toEqual(['b']);
        a.process();
        expect(a.state).toEqual(['b']);
    });

    it ('testing transitions', function() {
        const a = new Automaton();
        a.transitions = {
            'a': [
                [1, "b"]
            ],
            "b": [
                ["t_1", "c"],
                ["1", "b"]
            ]
        };
        const oInst = {
            x: 0,
            a() {

            },
            b() {

            },
            c() {

            },
            t_1() {
                return this.x > 10;
            }
        };
        a.instance = oInst;
        expect(a.state).toBe('a');
        a.process();
        expect(a.state).toEqual(['b']);
        a.process();
        oInst.x = 20;
        a.process();
        expect(a.state).toEqual(['c']);
    });



    it ('testing multistate', function() {
        const a = new Automaton();
        a.transitions = {
            'a': [
                [1, "b"]
            ],
            "b": [
                ["t_1", "c", "d", "e"],
                ["1", "b"]
            ]
        };
        const oInst = {
            x: 20,
            y: '',
            a() {

            },
            b() {

            },
            c() {
                this.y += 'c';
            },
            d() {
                this.y += 'd';
            },
            e() {
            },
            t_1() {
                return this.x > 10;
            }
        };
        a.instance = oInst;
        expect(a.state).toBe('a');
        a.process();
        expect(a.state).toEqual(['b']);
        a.process();
        oInst.x = 20;
        a.process();
        a.process();
        a.process();
        a.process();
        a.process();
        a.process();
        a.process();
        a.process();
        a.process();
        expect(oInst.y).toEqual('cd');
    });
});