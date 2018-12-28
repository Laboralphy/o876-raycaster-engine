/**
 * Temporise et retarde l'exécution de certaines commandes
 */
class Scheduler {

    constructor() {
        this.aCommands = [];
        this.bInvalid = true;
        this.nTime = 0;
        this._lastId = 0;
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
        this.aCommands.push({id, command, delay});
        this.bInvalid = true;
        return id;
    }

    /**
     * cancel a command that was previously declared with "delayCommand"
     * @param id {number} command identifier , given by delayCommand
     */
    cancelCommand(id) {
        const iIndex = this.aCommands.findIndex(c => c.id === id);
        if (iIndex >= 0) {
            this.aCommands.splice(iIndex, 1);
        }
    }

    /**
     * Will execute any command which delay has expired
     * @param nTime {number}
     */
    schedule(nTime) {
        this.nTime = nTime;
        if (this.bInvalid) { // trier en cas d'invalidité
            this.aCommands.sort(function(a, b) { return a.delay - b.delay; });
            this.bInvalid = false;
        }
        const aCommands = this.aCommands;
        while (aCommands.length > 0 && aCommands[0].delay <= nTime) {
            aCommands.shift().command();
        }
    }
}

export default Scheduler;