const Events = require('events');

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

    /**
     * renvoie identifiant du canal
     * @returns {number}
     */
	get id() {
        return this._id;
    }

    /**
     * défini identifiant du canal
     * @param value {number}
     */
    set id(value) {
        this._id = value;
    }

    /**
     * renvoie nom du canal
     * @returns {string}
     */
    get name() {
        return this._sName;
    }

    /**
     * défini nom du canal
     * @param value {string}
     */
    set name(value) {
        this._sName = value;
    }

    /**
     * renvoie type de canal
     * @returns {string}
     */
    get type() {
        return this._sType;
    }

    /**
     * défini type du canal
     * @param value {string}
     */
    set type(value) {
        this._sType = value;
    }

    /**
     * renvoie liste des utilisateur
     * @returns {User[]}
     */
    get users() {
        return this._users;
    }

    /**
     * renvoie la version affichable du canal
     * @returns {string}
     */
    display() {
        return '#' + this.id + ' (' + this.name + ')';
    }

    /**
     * Renvoie true si l(utilisateur sépcifié est présent dans le canal
     * @param u {User}
     * @returns {boolean}
     */
    userPresent(u) {
        return this._users.indexOf(u) >= 0;
    }

    /**
     * ajoute un nouvel utilisateur au canal
     * @param u {User}
     */
    addUser(u) {
        if (!this.userPresent(u)) {
            this._users.push(u);
            this._events.emit('user-added', {channel: this, user: u});
        } else {
            throw new Error('cannot add user ' + u.display() + ' in channel ' + this.display() + ' : already registered');
        }
    }

    /**
     * supprime un utilisateur du canal
     * @param u {User}
     */
    dropUser(u) {
        if (this.userPresent(u)) {
            let i = this._users.indexOf(u);
            this._events.emit('user-dropped', {channel: this, user: u});
			this._users.splice(i, 1);
        } else {
            throw new Error('cannot remove user ' + u.display() + ' from channel ' + this.display() + ' : user not registered in the channel');
        }
    }

    /**
     * Vire tous les utilisateur du canal
     */
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