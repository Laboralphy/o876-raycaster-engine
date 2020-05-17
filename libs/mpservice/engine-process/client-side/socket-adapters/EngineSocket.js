import STATUS from "../../../consts/status";

/**
 * Cette classe défini le comportement par défaut de la partie client de l'Engine
 * L'instance de cette classe gère une instance de Game, ainsi qu'une socket.
 * Elle propose des ordre pour communiquer avec le serveur (service Engine)
 */

const OVERLAY = true;
class EngineSocket {
	constructor({socket, game}) {

		this._socket = socket;
		this._game = game;

		/**
		 * Serveur : "Déconnexion du client"
		 */
		socket.on('disconnect', async () => {
			this.gameEnd();
		});

		/**
		 * Serveur : vous recevez un message d'erreur suite à sa dernière requete
		 */
		socket.on('G_ERROR', ({err}) => {
			console.error(err);
		});

		/**
		 * Serveur : vous recevez les données du niveau dans lequel vous devez évoluer
		 */
		socket.on('G_LOAD_LEVEL', ({level, live}) => {
			this._game.loadLevel(level, live);
		});

		/**
		 * Serveur : vous devez créer ce ou ces mobiles.
		 * Ce message est envoyé par ServiceEngine::transmitMobileCreationEvent
		 */
		socket.on('G_CREATE_MOBILE', async ({mobile}) => {
			if (Array.isArray(mobile)) {
				for (let i = 0, l = mobile.length; i < l; ++i) {
					let m = mobile[i];
					await this.req_load_bp(m.bp);
					game.netSpawnMobile(m);
				}
			} else {
				await this.req_load_bp(mobile.bp);
				game.netSpawnMobile(mobile);
			}
		});

		/**
		 * Serveur : voici l'identifiant qui vous a été attribué
		 * Ainsi que les données nécessaire au controle de votre mobile
		 */
		socket.on('G_CONTROL_MOBILE', (params) => {
			if ('id' in params) {
				game.localId = params.id;
			}
			let oMobile = game.getPlayer();
			if ('speed' in params) {
				oMobile.fSpeed = params.speed;
			}
		});


		/**
		 * Serveur : vous devez mettre à jour ce ou ces mobiles.
		 */
		socket.on('G_UPDATE_MOBILE', ({mobile}) => {
			if (Array.isArray(mobile)) {
				mobile.forEach(mov => game.netUpdateMobile(mov));
			} else {
				game.netUpdateMobile(mobile);
			}
		});

		/**
		 * Serveur : vous devez détruire ce ou ces mobiles.
		 */
		socket.on('G_DESTROY_MOBILE', ({mobile}) => {
			if (Array.isArray(mobile)) {
				mobile.forEach(m => game.netDestroyMobile(m));
			} else {
				game.netDestroyMobile(mobile);
			}
		});

        socket.on('G_DOOR_OPEN', ({x, y}) => {
            this._game.openDoor(x, y, true);
        });

        socket.on('G_DOOR_CLOSE', ({x, y}) => {
            this._game.closeDoor(x, y);
        });


	}

	/**
	 * Démarrage du jeu...
	 * plein de chose à initialiser
	 */
	gameInit() {
		MAIN.run(this._game);
		document.body.setAttribute('class', 'playing');

		/**
		 * Evenement de sortie du pointerlock
		 * Mettre à flou le canvas de jeu et afficher l'UI
		 */
		if (OVERLAY) {
			MAIN.pointerlock.on('exit', event => {
				this._game.trigger('pointer.unlock');
			});

			/**
			 * Evènement d'entrée dans le pointerlock
			 * Cache l'interface et rétabli la netteté du canvas
			 */
			MAIN.pointerlock.on('enter', event => {
				this._game.trigger('pointer.lock');
			});
		}
		/**
		 * Evènement : le client a fini de construire le niveau
		 * Envoie un message "ready" pour indiquer qu'on est pret à jouer
		 */
		this._game.on('enter', async event => {
			this.send_ready(STATUS.ENTERING_LEVEL);
		});

		this._game.on('frame', event => {
		});

		/**
		 * Evènement : le client a bougé son mobile
		 * transmetter au serveur la nouvelle situation geometrique
		 */
		this._game.on('player.update', async packet => {
			let t1 = performance.now();
			let aCorrPacket = await this.req_update_player(packet);
			let t2 = performance.now();
			this._game.ping(t2 - t1);
			this._game.applyMobileCorrection(aCorrPacket);
		});

		// est ce bien utile ?
		this._game.trigger('socket', {socket: this._socket});
	}

	/**
	 * Fonction sensée terminer le jeu
	 */
	gameEnd() {
		this._game._halt();
		if (MAIN.screen) {
			MAIN.screen.style.display = 'none';
		}
		this._socket.close();
		document.body.setAttribute('class', '');
		this._game.trigger('halt');
	}

	/**
	 * transmet le mouvement du joueur au serveur
	 * @param packet.a {number} angle visé par le mobile (direction dans laquelle il "regarde")
	 * @param packet.x {number} position x du mobile
	 * @param packet.y {number} position y du mobile
	 * @param packet.ma {number} angle adopté par le mouvement du mobile
	 * @param packet.ms {number} vitesse déduite du mobile (avec ajustement collision murale etc...)
	 * @param packet.c {number} commandes de tir, d'activation etc...
	 */
	async req_update_player(packet) {
		return new Promise(resolve => {
			this._socket.emit('REQ_G_UPDATE_PLAYER', packet, data => resolve(data));
		});
	}


	async req_load_bp(sResRef) {
		// télécharger le blueprint
		// vérifier si la tile attachée au blueprint est chargée
		// si non alors télécharger la tile
		// shader la tile
		// intégrer le blueprint
		return new Promise(resolve => {

			let rc = this._game.getRaycaster();
			let oHorde = rc.oHorde;

			if (sResRef in oHorde.oBlueprints) {
				// le blueprint est déja en mémoire
				resolve(oHorde.oBlueprints[sResRef]);
			} else {
				// envoyer une requète de chargement de ressource blueprint
				this._socket.emit('REQ_G_LOAD_RSC', {type: 'b', ref: sResRef}, blueprint => {

					/**
					 * Résoudre la promise en définissant le blueprint complet dans le raycaster
					 */
					function commitBP() {
						resolve(oHorde.defineBlueprint(sResRef, Object.assign({}, blueprint, {thinker: 'Net'})));
					}

					let sTileRef = blueprint.tile;
					if (sTileRef in oHorde.oTiles) {
						// la tile est déja définie
						commitBP();
					} else {
						// la tile n'est pas déja définie : effectuer une autre requète de chargement de ressource tile
						this._socket.emit('REQ_G_LOAD_RSC', {type: 't', ref: sTileRef}, tile => {
							let oTile = oHorde.defineTile(sTileRef, tile);

							/**
							 * Ombrer la tile nouvellemnet chargée puis résoudre la promise
							 */
							function shadeAndCommitBP() {
								commitBP();
								oTile.oImage = rc.shadeImage(oTile.oImage, true);
							}

							// l'image de la tile ...
							if (oTile.oImage.complete) {
								// ... est déja chargée
								shadeAndCommitBP();
							} else {
								// ... n'est pas déja chargée : on doit utiliser l'évènement load
								oTile.oImage.addEventListener('load', shadeAndCommitBP);
							}
						});
					}
				});
			}
		});
	}


	/**
	 * phase 0:
	 * Lorsque le client a fini la phase d'identification et qu'il attend
	 * des données du serveur il utilise ce message pour indiquer qu'il est près à les
	 * recevoir.
	 *
	 * phase 1:
	 * Lorsque le client a fini de charger le niveau et qu'il attend les données concernant les élément dynamiques
	 * comme les mobiles
	 *
	 * phase 2:
	 * Lorsque le client a fini de recevoir les données des entité dynamique et souhaite prendre le controle d'un mobile
	 */
	send_ready(phase) {
		if (phase === STATUS.GAME_INITIALIZED) {
			this.gameInit();
		}
		this._socket.emit('G_READY', {phase});
	}
}


export default EngineSocket;