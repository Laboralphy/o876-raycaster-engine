const Events = require('events')
const StateContext = require('./StateContext')
const schemaRepository = require('./schema-repository')

class Automaton {
    constructor() {
        this._states = {}
        this._currentState = ''
        this._initialState = ''
        this._events = new Events()
    }

    checkInput (oDefinition) {
        schemaRepository.validate(oDefinition, '/state')
        return true
    }

    get state () {
        return this._currentState
    }

    set state (value) {
        return this.changeState(value, 'jump')
    }

    get initialState () {
        return this._initialState
    }

    set initialState (value) {
        this._initialState = value
    }

    get events () {
        return this._events
    }

    defineState (sName, oStateDef) {
        this.checkInput(oStateDef)
        const oState = new StateContext(oStateDef)
        this._states[sName] = oState
        this._stack = []
        if (this._initialState === '') {
            this._initialState = sName
        }
        oState.events.on('action', eventObject => {
            this._events.emit('action', {
                state: sName,
                ...eventObject
            })
        })
        oState.events.on('test', eventObject => {
            this._events.emit('test', {
                state: sName,
                test: eventObject.test,
                parameters: eventObject.parameters,
                data: eventObject.data,
                pass(v = true) {
                    eventObject.pass(v)
                }
            })
        })
        oState.events.on('state', eventObject => {
            this.changeState(eventObject.state, eventObject.transitionType)
        })
        oState.events.on('back', () => {
            this.changeState(this._stack.pop(), 'back')
        })
        oState.events.on('parse', eventObject => {
            eventObject.output = eventObject
                .input
                .split(' ')
                .filter(s => s !== '')
                /**
                 * @param s {string}
                 */
                .map(s => {
                    const f = parseFloat(s)
                    return isNaN(f) ? s : f
                })
        })
        return oState
    }

    defineStates (oStates) {
        for (const [sState, oState] of Object.entries(oStates)) {
            this.defineState(sState, oState)
        }
    }

    /**
     *
     * @returns {StateContext}
     */
    get currentStateContext () {
        if (this._currentState === '') {
            this.enterState(this._initialState)
        }
        if (this._currentState === '' || this._currentState === undefined) {
            return undefined
        } else if (this._currentState in this._states) {
            return this._states[this._currentState]
        } else {
            throw new Error('state ' + this._currentState + ' unknown')
        }
    }

    changeState (sState, sType = 'jump') {
        switch (sType) {
            case 'jump': {
                this.exitState()
                this.enterState(sState)
                break
            }

            case 'call': {
                this.enterState(sState)
                break
            }

            case 'back': {
                this.exitState()
                this._currentState = sState
            }
        }
    }

    enterState (sState) {
        if (!(sState in this._states)) {
            throw new Error('state "' + sState + '" is undefined')
        }
        this._currentState = sState
        const sc = this.currentStateContext
        if (sc) {
            this._events.emit('state', { state: sState, data: sc.data })
            sc.runInit()
        }
    }

    exitState () {
        const sc = this.currentStateContext
        if (sc) {
            sc.runDone()
        }
    }

    process () {
        const sc = this.currentStateContext
        if (sc) {
            sc.runLoop()
            sc.runCall()
            sc.runBack()
            sc.runJump()
        }
    }
}

module.exports = Automaton