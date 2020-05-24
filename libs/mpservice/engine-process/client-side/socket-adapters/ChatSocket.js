import o876 from '../../../o876';

/**
 * Cette classe peut emettre un évènement "postline" lorsqu'il faut afficher une ligne dans la fenetre de chat
 * l'évènement est accompagné des paramètres suivant
 *
 * { // évènement "postline"
 * 		channel: {
 * 			id: string, // identifiant du canal
 * 			name: string // nom affichable du canal
 * 		},
 * 		client: { // !!! cette entrée est optionnelle
 * 			id: string, // identifiant du client qui a émis le message
 * 			name: string // nom affichable du clinet qui a émis ce message
 * 		},
 * 		message: string // contenu du message
 * }
 *
 *
 *
 */

class ChatSocket {
	constructor({socket}) {
		this._socket = socket;
		this._userCache = {};
		this._chanCache = {};
		this._emitter = new o876.Emitter();

		/**
		 * Serveur : "vous venez de rejoindre un canal"
		 */
		socket.on('MS_YOU_JOIN', async ({id}) => {
			let oChannel = await this.req_chan_info(id);
			if (oChannel) {
				this._emitter.trigger('newchan', oChannel);
			}
		});

		/**
		 * Serveur : "un utilisateur a rejoin l'un des canaux auxquels vous êtes connecté"
		 */
		socket.on('MS_USER_JOINS', async ({user, channel}) => {
			let oUser = await this.req_user_info(user);
			let oChannel = await this.req_chan_info(channel);
			this._emitter.trigger('postline', {
				id: oChannel.id,
				message: '[' + oChannel.name + ']: +' + oUser.name
			});
		});

		/**
		 * Serveur : "un utilisateur a quitté l'un des canaux auxquels vous êtes connecté"
		 */
		socket.on('MS_USER_LEAVES', async ({user, channel}) => {
			let oChannel = await this.req_chan_info(channel);
			this._emitter.trigger('postline', {
				id: oChannel.id,
				message: '[' + oChannel.name + ']: -' + user.name
			});
		});

		/**
		 * Serveur : "un utilisateur a envoyé un message de discussion sur un canal"
		 */
		socket.on('MS_USER_SAYS', async ({user, channel, message}) => {
			let oUser = await this.req_user_info(user);
			let oChannel = await this.req_chan_info(channel);
			this._emitter.trigger('postline', {
				id: oChannel.id,
				client: {id: oUser.id, name: oUser.name},
				message
			});
		});
	}

	get emitter() {
		return this._emitter;
	}



	/**
	 * Requète transmise au serveur : "Quelles sont les info relative à ce canal ?"
	 * On transmet l'id du canal recherché
	 * @param id {string} id du canal
	 * @returns {Promise<any>}
	 */
	async req_chan_info(id) {
		return new Promise(
			resolve => {
				if (id in this._chanCache) {
					resolve(this._chanCache[id]);
				} else {
					this._socket.emit(
						'REQ_MS_CHAN_INFO',
						{id},
						(data) => {
							if (data) {
								// il n'y a pas de registre de canaux dans le state
								this._chanCache[id] = data;
							}
							resolve(data);
						}
					);
				}
			}
		);
	}

	/**
	 * Requète transmise au serveur : "Quelles sont les info relative à cet utilisateur ?"
	 * On transmet l'id de l'utilisateur recherché
	 * @param id {string} id de l'utilisateur
	 * @returns {Promise<any>}
	 */
	async req_user_info(id) {
		return new Promise(
			resolve => {
				if (id in this._userCache) {
					resolve(this._userCache[id]);
				} else {
					this._socket.emit(
						'REQ_MS_USER_INFO',
						{id},
						async (data) => {
							if (data) {
								this._userCache[id] = data;
							}
							resolve(data);
						}
					);
				}
			}
		);
	}


	/**
	 * Envoi un message de discussion sur un canal donné.
	 * @param cid {String} identifiant du canal
	 * @param message {string} contenu du message
	 */
	send_say(cid, message) {
		this._socket.emit('MS_SAY', {channel: cid, message});
	}
}


export default ChatSocket;