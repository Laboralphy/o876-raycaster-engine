const Events = require('events');

class User {
    /**
     *
     * @param id {number|null}
     * @param name {string|null}
     */
    constructor({id = null, name = null}) {
        this._id = id;
        this._sName = name;
        this._events = new Events();
    }

    on(sEvent, pHandler) {
        this._events.on(sEvent, pHandler);
        return this;
    }

    /**
     * renvoie identifiant du user
     * @returns {number}
     */
    get id() {
        return this._id;
    }

    /**
     * défini identifiant du user
     * @param value {number}
     */
    set id(value) {
        this._id = value;
    }

    /**
     * renvoie nom du user
     * @returns {string}
     */
    get name() {
        return this._sName;
    }

    /**
     * défini nom du user
     * @param value {string}
     */
    set name(value) {
        this._sName = value;
    }

    idName() {
        return {id: this.id, name: this.name};
    }

    /**
     * Affiche une ligne de description pour les logs
     * @return {string}
     */
    display() {
        return '#' + this.id + ' (' + this.name + ')';
    }

    sendMessage(oDestination, sMessage) {
		oDestination.transmitMessage(this, sMessage);
    }

    transmitMessage(uFrom, sMessage, cFrom) {
        this._events.emit('message-received', {from: uFrom, to: this, channel: cFrom, message: sMessage});
    }
}

module.exports = User;