class LoginSocket {
	constructor({socket}) {
		this._socket = socket;
	}

	/**
	 * Envoi au serveur des données d'identification,
	 * renvoie par Promise un identifiant client si l'identification a réussi, sinon, renvoie null.
	 * @param name {string} nom
	 * @param pass {string}        if (this.isFree()) {
				this.oGame.gm_attack(0);
			} else {
				this.wtfHeld();
			}
	 this.nChargeStartTime = this.oGame.getTime();
	 mot de passe
	 */
	async req_login(name, pass) {
		return new Promise(
			resolve => {
				this._socket.emit(
					'REQ_LOGIN',
					{name, pass},
					({id}) => resolve(id)
				)
			}
		);
	}
}


export default LoginSocket;