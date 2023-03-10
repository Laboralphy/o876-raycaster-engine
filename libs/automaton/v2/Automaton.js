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
            this._events.emit('state', eventObject)
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
        for (const [sState, oState] of Object.entries(sState, oState)) {
            this.defineState(sState, oState)
        }
    }

    /**
     *
     * @returns {StateContext}
     */
    get currentStateContext () {
        if (this._currentState === '') {
            this._currentState = this._initialState
        }

        if (this._currentState === '' || this._currentState === undefined) {
            return undefined
        } else {
            return this._states[this._currentState]
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
        this._currentState = sState
        const sc = this.currentStateContext
        if (sc) {
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