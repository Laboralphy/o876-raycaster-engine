import Thinkers from './thinkers';
import ClientPrediction from './Predictor';
import PingMonitor from "./PingMonitor";
import RC from '../../consts/raycaster';
import GameAbstract from "libs/game-abstract";
import THINKERS from "./thinkers";

class Engine extends GameAbstract {

	constructor(config) {
		super();
		this.config(config);
		this._mobiles = {};
		this._clientPrediction = new ClientPrediction();
		this._pingMonitor = null;
		this._localId = '';
		this._levelLiveData = null; // ces données sont les données "vivantes" du niveau
		// ... à exploiter après le chargement complet du niveau
		this.setupPingMonitor();
		this.setupListeners();
	}

	init() {
		super.init();
		this.engine.events.on('update', () => this.engineUpdateHandler());
		this.engine.useThinkers(THINKERS);
	}

	/**
	 * Initialisation du moniteur de ping
	 */
	setupPingMonitor() {
		/*
		let config = this.getConfig();
		this._pingMonitor = ('ping' in config.game && config.game.ping) ? new PingMonitor(config.game.ping) : null;
		 */
	}

	/**
	 * Initialisation des écouteurs
	 */
	setupListeners() {
		//this.on('key.down', event => this.gameEventKey(event));
		this.on('level.loaded', event => this.gameEventEnter(event));
		this.on('update', event => this.gameEventDoomLoop(event));
		this.on('render', event => this.gameEventFrame(event));
	}




 // #####    ####            #####   ####    ####   #        ####
 // #    #  #    #             #    #    #  #    #  #       #
 // #    #  #                  #    #    #  #    #  #        ####
 // #####   #                  #    #    #  #    #  #            #
 // #   #   #    #             #    #    #  #    #  #       #    #
 // #    #   ####              #     ####    ####   ######   ####


	/**
	 * Ordonne le chargement d'un niveau par initialisation du Raycaster
	 * @param data {*} donnée du niveau
	 * @param liveData {*} donnée du niveau
	 */
	async loadLevel(data, liveData) {
		this._levelLiveData = liveData;
		this.engine.
		this.initRaycaster(data);
		let tm = this.engine.raycaster.oThinkerManager;
		tm.defineAlias('Net', Thinkers.Net);
	}


	/**
	 * Renvoi l'instance du joueur local
	 * @return O876_Raycaster.Mobile
	 */
	getPlayer() {
		return this.oRaycaster.oCamera;
	}

	get localId() {
		return this._localId;
	}

	set localId(value) {
		this._localId = value;
	}

	/**
	 * définir l'état initial des portes
	 */
	setDoorsInitialState(doors) {
		// définir l'état initial des portes
		let rc = this.oRaycaster;
		for (let d in doors) {
			let door = doors[d];
			let x = door.x,	y = door.y;
			this.openDoor(x, y);
			let oThisDoor = rc.getDoor(x, y);
			if (oThisDoor) {
				oThisDoor.setPhase(door.state, door.offset);
			}
		}
	}






 // ######  #    #  ######  #    #   #####   ####
 // #       #    #  #       ##   #     #    #
 // #####   #    #  #####   # #  #     #     ####
 // #       #    #  #       #  # #     #         #
 // #        #  #   #       #   ##     #    #    #
 // ######    ##    ######  #    #     #     ####

	// Liste des écouteurs d'évènements

	/**
	 * A chaque frame : afficher le moniteur de ping
	 * @param oEvent
	 */
	gameEventFrame(oEvent) {
		this.renderPing();
	}


	/**
	 * Le joueur entre dans un nouveau niveau.
	 * Réglage du thinker
	 * @param oEvent
	 */
	gameEventEnter(oEvent) {
		// player thinker configuration
		let player = this.getPlayer();
		let ct = new Thinkers.Player();
		ct.game = this;
		ct.mobile = player;
		player.setThinker(ct);
        ct.on('use.down', () => this.activateWall(player));
        let lld = this._levelLiveData;
		this.setDoorsInitialState(lld.doors);
        // exploitation des level live data
		// puis transmission
        this.trigger('level.live.data', lld);
    }


    /**
     * Event triggered when a key is pressed
     * @param oEvent {{k}}  k = pressed key code
	 */
    gameEventKey(oEvent) {
        switch (oEvent.k) {
			case KEYS.ENTER:
				break;

			case KEYS.ESCAPE:
				this.freeze();
				break;
        }
    }

	/**
	 * Chaque recalcul de l'état du raycaster entraine l'activation decet évènement
	 * @param oEvent
	 */
    gameEventDoomLoop(oEvent) {
    	// procede au calcul des positions des mobiles
		let aDeadMobiles = [];
		let mobs = this._mobiles;
		for (let i in mobs) {
			let mobile = mobs[i];
			//mobile.think();
			if (!mobile.bActive) {
				aDeadMobiles.push(i);
			}
		}
		aDeadMobiles.forEach(i => {
			delete this._mobiles[i];
		});
	}







 // #####      #     ####   #####   #         ##     #   #
 // #    #     #    #       #    #  #        #  #     # #
 // #    #     #     ####   #    #  #       #    #     #
 // #    #     #         #  #####   #       ######     #
 // #    #     #    #    #  #       #       #    #     #
 // #####      #     ####   #       ######  #    #     #


	/**
	 * Affichage du moniteur de ping
	 */
	renderPing() {
		let pm = this._pingMonitor;
		if (pm) {
			let cvs = this.oRaycaster.getRenderCanvas();
			let pmc = pm._canvas;
			this
				.oRaycaster
				.getRenderContext()
				.drawImage(
					pm.render(),
					cvs.width - 4 - pmc.width,
					cvs.height - 4 - pmc.height
				);
		}
	}

	/**
	 * Enregistre un ping en vue de l'afficher
	 * @param t
	 */
	ping(t) {
		if (this._pingMonitor) {
			this._pingMonitor.sample(t);
		}
	}

	/**
	 * Affichage d'un overlay
	 * Freeze les contrôles du joueur
	 */
	freeze() {
		let screen = MAIN.screen;
		screen.style.opacity = '0.5';
        screen.style.filter = 'blur(5px)';
		this.getPlayer().getThinker().freeze();
	}

	/**
	 * Supprime l'overlay
	 * Réactive les contrôles du joueur
	 */
	thaw() {
        let screen = MAIN.screen;
		screen.style.opacity = '1';
        screen.style.filter = '';
		this.getPlayer().getThinker().thaw();
	}





 // #    #   ####   #####           #          #    ######  ######
 // ##  ##  #    #  #    #          #          #    #       #
 // # ## #  #    #  #####           #          #    #####   #####
 // #    #  #    #  #    #          #          #    #       #
 // #    #  #    #  #    #          #          #    #       #
 // #    #   ####   #####           ######     #    #       ######


	// methodes de gestion des mobiles en réponse aux messages serveur
	// methodes de transmission des action utilisateur au serveur

	/**
	 * Le serveur a ordonné une correction de position du mobile
	 */
	applyMobileCorrection({a, x, y, sx, sy, id}) {
		// retrouver le packet id
		if (x === 0 || y === 0) throw new Error('Nope !');
		let mobile = this.getPlayer();
		let cp = this._clientPrediction;
		let packets = cp.getPacketsAfter(id);
		cp.flush(id);
		mobile.fTheta = a;
		mobile.setXY(x, y);
		if (packets.length) {
			packets.forEach(({t, a, x, y, sx, sy, id, c}) => {
				for (let i = 0; i < t; ++i) {
					mobile.fTheta = a;
					mobile.slide(sx, sy);
				}
			});
		}
	}

	/**
	 * Transmet au serveur les information de déplacement du mobile controlé par le joueur
	 * Mise en tampon
	 * La transmission se fait par évènement
	 * @param a {number} angle visé par le mobile (direction dans laquelle il "regarde")
	 * @param x {number} position x du mobile
	 * @param y {number} position y du mobile
	 * @param sx {number} angle adopté par le mouvement du mobile
	 * @param sy {number} vitesse déduite du mobile (avec ajustement collision murale etc...)
	 * @param c {number} commandes
	 */
	netUpdatePlayerMobile(a, x, y, sx, sy, c) {
		let packet = {a, x, y, sx, sy, c};
		let cp = this._clientPrediction;
		let sendPacket = cp.pushMovement(packet);
		if (sendPacket) {
			this.trigger('player.update', sendPacket);
		}
	}


	/**
	 * Creation d'un mobile, suite à un ordre du serveur
	 * Ne pas créer de mobile qui a le même id que le player
	 * Le format recu découle directement du format renvoyé par
	 * ServiceEngine::buildMobileCreationPacket
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param sx {number} vitesse aux axes : x
	 * @param sy {number} vitesse aux axes : y
	 * @param a {number} angle
	 * @param bp {string} blueprints
	 */
	netSpawnMobile({id, a, x, y, sx, sy, bp}) {
		if (id !== this.localId) {
			let m = this.spawnMobile(bp, x, y, a);
			let thinker = m.getThinker();
			thinker.game = this;
			thinker.mobile = m;
			// peut etre faudra t il enrichir le message de creation recu
			// afin d'incorporé une indication sur la nature du mobile (missile, mobile...)
			m.oSprite.playAnimationType(sx || sy ? RC.animation_walk : RC.animation_stand);
			m.getThinker().setMovement(a, x, y, sx, sy);
			this._mobiles[id] = m;
			m.id = id;
		}
	}

	/**
	 * Mise à jour de mobile, suite à un ordre du serveur
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param sx {number} vitesse
	 * @param sy {number} vitesse
	 * @param a {number} angle
	 */
	netUpdateMobile({id, a, x, y, sx, sy, f}) {
		if (id === this.localId) {
			return;
		}
		if (id in this._mobiles) {
			this._mobiles[id].getThinker().setMovement(a, x, y, sx, sy);
			if (f && f.length) {
				// on va pas pouvoir gérer les vecteurs force : cela va retro agir avec le serveur...
			}
		}
	}

	/**
	 * destruction de mobile, suite à un ordre du serveur
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param sx {number} vitesse
	 * @param sy {number} vitesse
	 * @param a {number} angle
	 */
	netDestroyMobile({id, a, x, y, sx, sy}) {
		if (id === this.localId) {
			return;
		}
		if (id in this._mobiles) {
			let mth = this._mobiles[id].getThinker();
			mth.setMovement(a, x, y, sx, sy);
			mth.die();
		}
	}
}

export default Engine;