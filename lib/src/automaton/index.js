/**
 * Automaton
 *
 * @description This class manages a state machine
 * The most common way to use this class is :


 ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE //////
 ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE //////
 ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE ////// EXAMPLE //////


 const sm = new Automaton();

 class Client {
     test1(x) {
         return x < 0;
     }

     state1(...args) {
          console.log('we are in state1:', ...args);
     }

     state2(...args) {
          console.log('we are in state2:', ...args);
     }
 }

 sm.transitions = {
    'state1': {
        'test1': 'state2'
    },
    'state2': {
    }
 };

 sm.instance = new Client();
 sm.process(5);
 sm.process(9);
 sm.process(4);
 sm.process(1);
 sm.process(0);
 sm.process(-1); // <-- will go to state 2
 sm.process(-3); // <-- is now in state 2
 sm.process(0);


 *
 * @author Raphaël Marandet
 * @email raphael.marandet(at)gmail(dot)com
 * @date 2019-06-12
 */
class Automaton {
    /**
     * Constructor
     */
    constructor() {
        this._state = '';
        this._transitions = {};
        this._instance = null;
        this._verbose = false;
        this._log = [];
    }

    /**
     * Return the verbose flag value.
     * @return {boolean}
     */
    get verbose() {
        return this._verbose;
    }

    /**
     * sets the verbose flag value
     * if set to true, the instance will log any state changing
     * @param value {boolean}
     */
    set verbose(value) {
        this._verbose = value;
    }

    /**
     * return the current state value
     * @return {string}
     */
    get state() {
        return this._state;
    }

    /**
     * change the current state
     * @param value {string}
     */
    set state(value) {
        this._state = value;
    }

    /**
     * return the transition list
     * @return {{}|*}
     */
    get transitions() {
        return this._transitions;
    }

    /**
     * define the state-machine transitions
     * format :
     * {
     *     "@state-1": {
     *          "@test-method-1": "goto-state-1",
     *          "@test-method-2": "goto-state-2"
     *     },
     *     "@state-2": {
     *          "@test-method-3": "goto-state-3",
     *          "@test-method-4": "goto-state-4"
     *     },
     * }
     * @param value
     */
    set transitions(value) {
        this._transitions = value;
        this._state = Object.keys(value).shift();
    }

    /**
     * returns the working instance
     * @return {null}
     */
    get instance() {
        return this._instance;
    }

    /**
     * Sets a new working instance, which contains all state-methods and all test-methods
     * @param value {*}
     */
    set instance(value) {
        this._instance = value;
    }

    log(...args) {
        if (this._verbose) {
            console.info(...args);
        }
    }

    /**
     * Run a transition test and returns the outcomming value
     * @param test {string} name of a test-method inside this instance
     * @param state {string} name of the state we want to go to
     * @param args {[]} extra arguments passed to the test-method
     * @return {boolean} outcome
     * @private
     */
    _invokeTransition(test, state, ...args) {
        if (test == 0) {
            this.log('test', test, false);
            return false;
        } else if (test == 1) {
            this.log('test', test, true, 'new state', state);
            this._state = state;
            return true;
        }
        if (test in this._instance) {
            if (this._instance[test](...args)) {
                this.log('test', test, true, 'new state', state);
                this._state = state;
                return true;
            } else {
                this.log('test', test, false);
            }
        } else {
            throw new Error('this transition does not exists : "' + test + '"');
        }
        return false;
    }

    _invokeState(s, ...args) {
        this.log('state', s, ...args);
        if (s in this._instance) {
            this._instance[s](...args);
        }
    }

    process(...args) {
        const state = this._state;
        this._invokeState(state, ...args);
        // compute transition
        if (state in this._transitions) {
            const transitions = this._transitions[state];
            for (let t in transitions) {
                if (transitions.hasOwnProperty(t) && this._invokeTransition(t, transitions[t], ...args)) {
                    break;
                }
            }
        }
    }

}

export default Automaton;
