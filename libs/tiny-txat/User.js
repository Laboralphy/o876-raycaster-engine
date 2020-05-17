const o876 = require('../o876/index');
const prop = o876.SpellBook.prop;
const Events = require('events');

class User {

    constructor({id = null, name = null}) {
        this._id = id;
        this._sName = name;
        this._events = new Events();
    }

    on(sEvent, pHandler) {
        this._events.on(sEvent, pHandler);
        return this;
    }

    id(id) {
        return prop(this, '_id', id);
    }

    name(s) {
        return prop(this, '_sName', s);
    }

    idName() {
        return {id: this.id(), name: this.name()};
    }

    /**
     * Affiche une ligne de description pour les logs
     * @return {string}
     */
    display() {
        return '#' + this.id() + ' (' + this.name() + ')';
    }

    sendMessage(oDestination, sMessage) {
		oDestination.transmitMessage(this, sMessage);
    }

    transmitMessage(uFrom, sMessage, cFrom) {
        this._events.emit('message-received', {from: uFrom, to: this, channel: cFrom, message: sMessage});
    }
}

module.exports = User;