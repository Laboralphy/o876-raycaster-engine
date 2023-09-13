const Events = require('events')
class StateContext {
    constructor(oDefinition = {}) {
        const { back = [], call = [], data = {}, init = [], loop = [], done = [], jump = [] } = oDefinition
        this._data = typeof data === 'function' ? data(this) : { ...data }
        this._init = Array.isArray(init) ? init : [init] // liste des actions effectuées au début de l'état
        this._loop = Array.isArray(loop) ? loop : [loop] // liste des actions effectuées en boucle
        this._done = Array.isArray(done) ? done : [done] // liste des actions effectuées lorsque l'état change
        this._call = Array.isArray(call) ? call : [call] // appel d'un autre état
        this._back = Array.isArray(back) ? back : [back] // retourne à l'état qui a invoqué call
        this._jump = Array.isArray(jump) ? jump : [jump] // changement d'état
        this._events = new Events
    }

    get data () {
        return this._data
    }

    get events () {
        return this._events
    }

    runActions (a) {
        a.forEach(s => {
            this.invokeAction(s)
        })
    }

    runSmth (s) {
        this.runActions(this['_' + s])
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
        for (const { test = undefined, state, actions = [] } of this._jump) {
            if (test === undefined || this.invokeTest(test)) {
                this.runActions(actions)
                this._events.emit('state', { state, data: this._data, transitionType: 'jump' })
                break
            }
        }
    }

    runCall () {
        for (const { test = undefined, state } of this._call) {
            if (test === undefined || this.invokeTest(test)) {
                this._events.emit('state', { state, data: this._data, transitionType: 'call' })
                break
            }
        }
    }

    runBack () {
        for (const { test = undefined } of this._back) {
            if (test === undefined || this.invokeTest(test)) {
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
