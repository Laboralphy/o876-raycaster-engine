/**
 * Temporise et retarde l'exécution de certaines commandes
 */
class Scheduler {

    constructor() {
        this.aCommands = [];
        this.bInvalid = true;
        this.nTime = 0;
    }

    /**
     * Push a command on the list
     * @param command
     * @param delay
     */
    delayCommand(command, delay) {
        delay += this.nTime;
        this.aCommands.push({command, delay});
        this.bInvalid = true;
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
        while (aCommands.length > 0 && aCommands[0].delay < nTime) {
            aCommands.shift().command();
        }
    }
}

export default Scheduler;