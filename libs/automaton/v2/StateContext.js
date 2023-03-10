const Events = require('events')
class StateContext {
    constructor(oDefinition = {}) {
        const { back = [], call = [], data = {}, init = [], loop = [], done = [], jump = [] } = oDefinition
        this._data = typeof data === 'function' ? data(this) : { ...data }
        this._init = Array.isArray(init) ? init : [init]
        this._loop = Array.isArray(loop) ? loop : [loop]
        this._done = Array.isArray(done) ? done : [done]
        this._call = Array.isArray(call) ? call : [call]
        this._back = Array.isArray(back) ? back : [back]
        this._jump = Array.isArray(jump) ? jump : [jump]
        this._events = new Events
    }

    get events () {
        return this._events
    }

    runSmth (s) {
        this['_' + s].forEach(s => {
            this.invokeAction(s)
        })
    }

    runInit () {
        this.runSmth('init')
    }

    runLoop () {
        this.runSmth('loop')
    }

    runDone () {
        this.runSmth('done')
    }

    runJump () {
        for (const { test, state } of this._jump) {
            if (this.invokeTest(test)) {
                this._events.emit('state', { state, transitionType: 'jump' })
                break
            }
        }
    }

    runCall () {
        for (const { test, state } of this._call) {
            if (this.invokeTest(test)) {
                this._events.emit('state', { state, transitionType: 'call' })
                break
            }
        }
    }

    runBack () {
        for (const { test } of this._back) {
            if (this.invokeTest(test)) {
                this._events.emit('back', {})
                break
            }
        }
    }

    parseScriptArguments (sInput) {
        const r = sInput.match(/^\s*(\S+)\s*(.*)$/)
        if (r) {
            const eventObject = {
                opcode: r[1],
                input: r[2],
                output: r[2]
            }
            this._events.emit('parse', eventObject)
            return {
                opcode: eventObject.opcode,
                parameters: eventObject.output
            }
        } else {
            throw new Error('Parse Error: could not parse input string')
        }
    }

    invokeAction (action) {
        const { opcode, parameters } = this.parseScriptArguments(action)
        this._events.emit('action', {
            action: opcode,
            parameters,
            data: this._data
        })
    }

    invokeTest (test) {
        const { opcode, parameters } = this.parseScriptArguments(test)
        const eventObject = {
            test: opcode,
            parameters,
            data: this._data,
            _result: false,
            pass(v = true) {
                this._result = Boolean(v)
            }
        }
        this._events.emit('test', eventObject)
        return eventObject._result
    }
}

module.exports = StateContext
