const Events = require('events');


class System {

    constructor() {
        this._users = [];
        this._channels = [];
        this._events = new Events();
    }

	on(sEvent, pHandler) {
		this._events.on(sEvent, pHandler);
		return this;
	}

	channelPresent(c) {
        return this._channels.indexOf(c) >= 0;
    }

    userPresent(u) {
        return this._users.indexOf(u) >= 0;
    }

    _eventUserJoins(event) {
        // transmettre l'évènement à tous les utilisateurs du canal
        event.channel.users().forEach(u => {
			this._events.emit('user-joins', {
				to: u.id,
				user: event.user.id,
				channel: event.channel.id
			});
		});
    }

    _eventUserLeaves(event) {
		event.channel.users().forEach(u =>
			this._events.emit('user-leaves', {
				to: u.id,
				user: event.user.idName(), // le user est sur le point de disparaitre
				channel: event.channel.id
			})
		);
    }

    _eventUserGotMessage(event) {
        this._events.emit('user-message', {
            to: event.to.id,
            user: event.from.id,
            channel: event.channel ? event.channel.id : null,
            message: event.message
        });
    }

    addUser(u) {
        if (!this.userPresent(u)) {
            this._users.push(u);
            u.on('message-received', event => this._eventUserGotMessage(event));
        } else {
            throw new Error('user ' + u.display() + ' is already registered on the system');
        }
    }

    dropUser(u) {
        if (this.userPresent(u)) {
            // remove from all channels
            this.getUserChannels(u).forEach(function(c) {
                c.dropUser(u);
            });
            let i = this._users.indexOf(u);
            this._users.splice(i, 1);
            // if no more users, and channel is not persistant
        }
    }

	/**
     * Renvoie la liste des canaux auxquels le user est connecté
	 * @param u
	 */
	getUserChannels(u) {
	    return this._channels.filter(function(c) {
			return c.userPresent(u);
		});
    }

    getUser(id) {
        return this._users.find(u => u.id === id);
    }

    addChannel(c) {
		if (!c.id) {
			throw new Error('cannot register channel : it has no valid identifier');
		}
		if (!c.name) {
			throw new Error('cannot register channel : it has no valid name');
		}
		if (this.getChannel(c.id)) {
			throw new Error('cannot register channel : id "' + c.id + '" is already in use');
		}
		if (this.searchChannel(c.name)) {
			throw new Error('cannot register channel : name "' + c.name + '" is already in use');
		}
		if (this.channelPresent(c)) {
			throw new Error('cannot register channel ' + c.display() + ' : already registered');
		}
		this._channels.push(c);
		c.on('user-added', event => this._eventUserJoins(event));
		c.on('user-dropped', event => this._eventUserLeaves(event))
    }

    getChannel(id) {
	    return this._channels.find(c => c.id === id);
    }

    searchChannel(sName) {
		return this._channels.find(c => c.name === sName);
	}

    dropChannel(c) {
        if (this.channelPresent(c)) {
            c.purge();
            let i = this._channels.indexOf(c);
            this._channels.splice(i, 1);
            this._events.emit('channel-dropped', {channel: c});
        } else {
            throw new Error('cannot register channel ' + c.display() + ' : already registered');
        }
    }
}

module.exports = System;