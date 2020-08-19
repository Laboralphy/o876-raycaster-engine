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
      test1() {
         return this.x < 0;
     }

     state1() {
          console.log('we are in state1:');
     }

     state2() {
          console.log('we are in state2:');
     }
 }

 sm.transitions = {
    'state1': [
        ['test1', 'state2']
    },
    'state2': {
    }
 };

 sm.instance = new Client();
 sm.instance.x = 1;
 sm.process();
 sm.process();
 sm.process();
 sm.process();
 sm.process();
 sm.instance.x = -1;
 sm.process(); // <-- will go to state 2
 sm.process(); // <-- is now in state 2
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
        if (this._state === '') {
            this._state = Object.keys(value).shift();
            this.log('initial state', this._state);
        }
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
    _invokeTransition(test, state) {
        if (test == 0) {
            this.log('test', test, false);
            return false;
        } else if (test == 1) {
            this.log('test', test, true, 'new state', state);
            this._state = state;
            return true;
        }
        if (test in this._instance) {
            if (this._instance[test]()) {
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

    _invokeState(s) {
        if (s in this._instance) {
            this.log('state', s);
            this._instance[s]();
        } else {
            this.log('state', s, '(virtual)');
        }
    }

    process() {
        const state = this._state;
        if (Array.isArray(state)) {
            state.forEach(s => {
                this._state = s;
                this._invokeState(s);
            });
        } else {
            this._invokeState(state);
        }
        // compute transition
        if (state in this._transitions) {
            const transitions = this._transitions[state];
            for (let i = 0, l = transitions.length; i < l; ++i) {
                const transition = transitions[i];
                if (transition.length < 2) {
                    throw new Error('transition must have at least 2 items [test, state]');
                }
                const test = transition[0];
                const states = transition.slice(1);
                if (this._invokeTransition(test, states)) {
                    break;
                }
            }
        }
    }

}

export default Automaton;
