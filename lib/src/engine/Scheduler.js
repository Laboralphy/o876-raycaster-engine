/**
 * Temporise et retarde l'exécution de certaines commandes
 */
class Scheduler {

    constructor() {
        this.aCommands = {
            delayed: [],
            looped: []
        };
        this.bInvalid = true;
        this.nTime = 0;
        this._lastId = 0;
    }

    /**
     * executes a command again and again.
     * time duration between each execution is specified
     * @param command {function} function to be called back
     * @param duration {number} number of milliseconds between one execution and the next
     */
    loopCommand(command, duration) {
        const id = ++this._lastId;
        this.aCommands.looped.push({id, command, duration, time: duration + this.nTime});
        return id;
    }

    /**
     * Push a command on the list
     * @param command {function}
     * @param delay {number}
     * @return {number} an identifier that work pretty much like setTimeout
     * and can be used with cancelCommand, in case you want to cancel the command
     */
    delayCommand(command, delay) {
        delay += this.nTime;
        const id = ++this._lastId;
        this.aCommands.delayed.push({id, command, delay});
        this.bInvalid = true;
        return id;
    }

    /**
     * cancel a command that was previously declared with "delayCommand"
     * @param id {number} command identifier , given by delayCommand
     */
    cancelCommand(id) {
        let d = this.aCommands.delayed;
        let iIndex = d.findIndex(c => c.id === id);
        if (iIndex >= 0) {
            d.splice(iIndex, 1);
        }
        d = this.aCommands.looped;
        iIndex = d.findIndex(c => c.id === id);
        if (iIndex >= 0) {
            d.splice(iIndex, 1);
        }
    }

    /**
     * Will execute any command which delay has expired
     * @param nTime {number}
     */
    schedule(nTime) {
        const d = this.aCommands.delayed;
        this.nTime = nTime;
        if (this.bInvalid) { // trier en cas d'invalidité
            d.sort(function(a, b) { return a.delay - b.delay; });
            this.bInvalid = false;
        }
        while (d.length > 0 && d[0].delay <= nTime) {
            d.shift().command();
        }
        const aLooped = this.aCommands.looped;
        for (let i = 0, l = aLooped.length; i < l; ++i) {
            const c = aLooped[i];
            while (c.time <= nTime) {
                c.time += c.duration;
                c.command();
            }
        }
    }
}

export default Scheduler;