const Events = require('events');
const o876 = require('../o876/index');
const prop = o876.SpellBook.prop;

let _chanId = 1000;

class Channel {
    constructor() {
        this._users = [];
        this._id = _chanId++;
        this._sName = '';
        this._sType = '';
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

    type(s) {
        return prop(this, '_sType', s);
    }

    users() {
        return this._users;
    }

    display() {
        return '#' + this.id() + ' (' + this.name() + ')';
    }

    userPresent(u) {
        return this._users.indexOf(u) >= 0;
    }

    addUser(u) {
        if (!this.userPresent(u)) {
            this._users.push(u);
            this._events.emit('user-added', {channel: this, user: u});
        } else {
            throw new Error('cannot add user ' + u.display() + ' in channel ' + this.display() + ' : already registered');
        }
    }

    dropUser(u) {
        if (this.userPresent(u)) {
            let i = this._users.indexOf(u);
            this._events.emit('user-dropped', {channel: this, user: u});
			this._users.splice(i, 1);
        } else {
            throw new Error('cannot remove user ' + u.display() + ' from channel ' + this.display() + ' : user not registered in the channel');
        }
    }

    purge() {
        while (this._users.length) {
            this.dropUser(this._users[0]);
        }
    }

    /**
     * diffuse un message a tous les utilisateur du canal
     * @param u {User}
     * @param sMessage {string}
     */
    transmitMessage(u, sMessage) {
        if (this.userPresent(u)) {
			this._users.forEach(udest => udest.transmitMessage(u, sMessage, this));
        } else {
            throw new Error('cannot transmit message from user ' + u.display() + ' on channel ' + this.display() + ' : user not registered in the channel')
        }
    }
}

module.exports = Channel;