const Player = require('./Player');
const Mobile = require('./Mobile');
const Area = require('./Area');
const Location = require('./Location');

// thinkers
const TangibleThinker = require('./thinkers/TangibleThinker');
const MissileThinker = require('./thinkers/MissileThinker');

const ResourceLoader = require('../resource-loader/index');
const logger = require('../logger/index');
const Vector = require('libs/geometry/Vector');

const Events = require('events');
const uniqid = require('uniqid');

const STRINGS = require('../consts/strings');
const STATUS = require('../consts/status');
const COMMANDS = require('../consts/commands');
const EVENTS = require('../consts/events')
const RC = require('../consts/raycaster');

const GeometryHelper = require('libs/geometry/GeometryHelper');

/**
 * Cette classe gère les différents use cases issu du réseau ou de tout autre évènements
 */
class Core {
    constructor() {
        this._areas = {};
        this._players = {};
        this._mobiles = {};

        this._events = new Events();
        this._resourceLoader = new ResourceLoader();
    }

// #####   #####    ####   #    #     #    ######   ####
// #    #  #    #  #    #   #  #      #    #       #
// #    #  #    #  #    #    ##       #    #####    ####
// #####   #####   #    #    ##       #    #            #
// #       #   #   #    #   #  #      #    #       #    #
// #       #    #   ####   #    #     #    ######   ####

	on(...args) {
    	this._events.on(...args);
	}


    /**
	 * Renvoie le type de mobile parmis ceux des constante MOBILE_TYPE_*
     * @param mobile
     * @return {string}
     */
	static getMobileType(mobile) {
    	return mobile.data.type;
	}

    /**
	 * Renvoie les coordonnées (sous forme de vecteur) d'un mobile
     * @param mobile
     * @return {Location}
     */
	static getMobileLocation(mobile) {
		return mobile.location;
	}

    /**
	 * Renvoie les coordonnéed d'un locator
     * @param location {Location}
     * @return {Vector}
     */
    static getLocationPosition(location) {
        return location.position();
    }

    /**
     * Renvoie la zone du locator spécifié
     * @param location {Location}
     * @return {Area}
     */
    static getLocationArea(location) {
        return location.area();
    }

    /**
	 * Renvoie le nom de la zone spécifiée
     * @param area {Area}
     * @return {String}
     */
    static getAreaName(area) {
		return area.name;
	}

    /**
	 * Renvoie des information relative au block qui se trouve à la location spécifiée
     * @param location {Location} position du block qu'on souhaite étudier
	 * @return {*}
     */
	static getBlockAtLocation(location) {
		let pos = location.position();
		let x = pos.x / RC.plane_spacing | 0;
		let y = pos.y / RC.plane_spacing | 0;
		return location.area().getCell(x, y);
	}

    /**
	 * Renvoie une nouvelle location située devant la location spécifiée, à une certaine distance
	 * Si la distance n'est pas spécifiée on prend plane_spacing comme valeur par defaut
	 * l'angle de heading est utilisé pour déterminer l'avant de la location
     * @param location {Location}
     * @param distance {number} défaut : 64
     */
	static getFrontLocation(location, distance) {
		if (distance === undefined) {
			distance = RC.plane_spacing;
		}
        let pos = location.position();
        let angle = location.heading();
        let x = pos.x + distance * Math.cos(angle);
        let y = pos.y + distance * Math.sin(angle);
        let locNew = new Location();
        locNew.assign(location);
        locNew.position().set(x, y);
        return locNew;
	}

	/**
	 * Renvoie true si le block spécifié est en fait une porte
	 * @param block
	 * @returns {boolean}
	 */
	static isDoor(block) {
		return !!block.door
	}

    /**
     * renvoie true si la porte est verrouillée
     * @param block
	 * @return {boolean}
     */
	static isDoorLocked(block) {
		return !!block.door && block.door.bLocked;
	}

    /**
     * Verouille une porte
     * @param block
     */
    static lockDoor(block) {
        if (block.door) {
            block.door.bLocked = true;
        }
    }

    /**
	 * Déverouille une porte
     * @param block
     */
    static unlockDoor(block) {
        if (block.door) {
            block.door.bLocked = false;
        }
    }

    /**
	 * Ouverture d'une porte
     * @param block {*} structure de description du block
     * @param nAutoCloseDelay {number} durée au dela de laquelle la porte se referme
	 * si pas spécifié alors la porte ne se referme pas
	 * @return {boolean} renvoie true si la porte s'est bien ouverte, ou false sinon (verrou, ou pas vraiment une porte)
     */
	static openDoor(block, nAutoCloseDelay) {
		if (block.door) {
			let oDoor = block.door;
			if (nAutoCloseDelay && oDoor.type !== RC.phys_secret_block) {
				oDoor.bAutoclose = true;
				oDoor.nAutocloseDelay = nAutoCloseDelay / RC.time_factor | 0;
			}
            // il faut indiquer à tous les clients de la zone qu'une porte est ouverte
            block.area.openDoor(block.x, block.y);
		}
	}



//  ####   ######   #####   #####  ######  #####    ####
// #    #  #          #       #    #       #    #  #
// #       #####      #       #    #####   #    #   ####
// #  ###  #          #       #    #       #####        #
// #    #  #          #       #    #       #   #   #    #
//  ####   ######     #       #    ######  #    #   ####


    // Les getters permettent d'interoger l'état du jeu

	/**
	 * Renvoie l'instance du datamanger
	 * @returns {ResourceLoader}
	 */
	get resourceLoader() {
    	return this._resourceLoader;
	}

    /**
     * Renvoie une instance d'Area
     * @param id
     * @return Area
     */
    async getArea(id) {
		let area;
		if (id in this._areas) {
			area = this._areas[id];
		} else {
			area = await this.buildArea(id);
			this.linkArea(id, area);
		}
		return area;
    }

	/**
     * Renvoie la liste des mobiles qui sont dans la zone spécifiée
     * @param area {Area} zone dans laquelle s'effectue la recherche
     * @return {Array.<Mobile>}
	 */
	getAreaMobiles(area) {
		return Object
			.values(this._mobiles)
			.filter(px => px.location.area() === area);
    }

	/**
     * Renvoie la liste des joueurs qui sont dan sla zone
	 * @param area {Area}
	 */
	getAreaPlayers(area) {
		return Object
			.values(this._players)
			.filter(px => px.location.area() === area);
    }









//  #####  #####     ##    #    #   ####   #    #     #     #####  #####    ####
//    #    #    #   #  #   ##   #  #       ##  ##     #       #    #    #  #
//    #    #    #  #    #  # #  #   ####   # ## #     #       #    #    #   ####
//    #    #####   ######  #  # #       #  #    #     #       #    #####        #
//    #    #   #   #    #  #   ##  #    #  #    #     #       #    #   #   #    #
//    #    #    #  #    #  #    #   ####   #    #     #       #    #    #   ####


	/**
	 * Transmission du changement de mouvement d'un mobile
	 * @param mobileRegistryArea {array} assoc map -> list of mobile
	 * cet objet contient pour chaque area, la liste des mobile à updaté
	 * (ceux dont le mouvement a changé).
	 */
	transmitMobileMovement(mobileRegistryArea) {
		let aTransmit = [];
		for (let idArea in mobileRegistryArea) {
			let mobs = mobileRegistryArea[idArea];
			let a = this._areas[idArea];
			let p = this.getAreaPlayers(a);
			aTransmit.push({
				p,
				m: mobs.map(
					mobile => mobile.thinker().getMovement()
				).filter(mov => !!mov)
			});
		}
		return aTransmit;
	}



// #    #  ######  #       #####   ######  #####    ####
// #    #  #       #       #    #  #       #    #  #
// ######  #####   #       #    #  #####   #    #   ####
// #    #  #       #       #####   #       #####        #
// #    #  #       #       #       #       #   #   #    #
// #    #  ######  ######  #       ######  #    #   ####

    // Les helpers aide à faires différent truc
    // les builder aident à fabriquer les paquet de données à partir d'entité



	/**
	 * Construction d'une nouvelle zone
	 * @param id {string} identifiant de référence de la zone
	 */
	async buildArea(id) {
		logger.logfmt(STRINGS.game.building_level, id);
		let area = new Area();
		area.id = id;
		area.name = id;
		let level = await this._resourceLoader.loadLevel(id);
		area.data(level);
		logger.logfmt(STRINGS.game.level_built, id);
		this._events.emit('area.built', {area});
        area.emitter.on(EVENTS.DOOR_OPEN, ({door}) => {
            this._events.emit(EVENTS.DOOR_OPEN, {
                players: this.getAreaPlayers(area).map(p => p.id),
                x: door.x,
                y: door.y
            })
        });
        area.emitter.on(EVENTS.DOOR_CLOSE, ({door}) => {
            this._events.emit(EVENTS.DOOR_CLOSE, {
            	players: this.getAreaPlayers(area).map(p => p.id),
                x: door.x,
                y: door.y
            })
        });
		return area;
	}




 // #####    ####    ####   #    #  #        ####    ####   #####
 // #    #  #    #  #    #  ##  ##  #       #    #  #    #  #    #
 // #    #  #    #  #    #  # ## #  #       #    #  #    #  #    #
 // #    #  #    #  #    #  #    #  #       #    #  #    #  #####
 // #    #  #    #  #    #  #    #  #       #    #  #    #  #
 // #####    ####    ####   #    #  ######   ####    ####   #

    /**
	 * Effectue le traitemenbt sur les portes
     */
	processDoors() {
		for (let a in this._areas) {
			let area = this._areas[a];
			let collider = area.collider();
			// le soucis c'est que des mobiles peuvent coincer les portes
			area._activeDoorList.items.forEach(door => {
				let x = door.x;
				let y = door.y;
				// isoler le secteur x y
				door.bObstructed = collider.sector(x, y).objects().length > 0;
			});
			area.processDoors();
		}
	}

	/**
	 * renvoie la modification de l'état du jeu, afin de transmettre cela aux différents clients
	 * - modification des clients (position, angle, vitesse)
	 * - creation de mobiles
	 * - suppression de mobile
	 * - changement de l'état des portes
	 * - ...
	 */
	getStateMutations() {
		let mobiles = this._mobiles;
		let updateTheseMobiles = {};
		let destroyTheseMobiles = {};
		for (let id in mobiles) {
			let m = mobiles[id];
			m.think();
			let area = m.location.area().id;
			if (m.thinker().hasChangedMovement() || m.hasForces()) {
				if (!m.isDead()) {
					if (!(area in updateTheseMobiles)) {
						updateTheseMobiles[area] = [];
					}
					updateTheseMobiles[area].push(m);
				}
			}
			if (m.isDead()) {
				if (!(area in destroyTheseMobiles)) {
					destroyTheseMobiles[area] = [];
				}
				destroyTheseMobiles[area].push(m);
			}
		}
		// tous les mobiles qui modifie l'uniformité de leur mouvement doivent donner lieu
		// a un message transmis aux joueurs de la zone
		return {
			// mobile update
			mu: this.transmitMobileMovement(updateTheseMobiles),
			md: this.transmitMobileMovement(destroyTheseMobiles)
		}
	}



// #    #  #    #   #####    ##     #####  ######  #####    ####
// ##  ##  #    #     #     #  #      #    #       #    #  #
// # ## #  #    #     #    #    #     #    #####   #    #   ####
// #    #  #    #     #    ######     #    #       #####        #
// #    #  #    #     #    #    #     #    #       #   #   #    #
// #    #   ####      #    #    #     #    ######  #    #   ####


	/**
	 * Supprime les mobiles qui ont l'état "dead"
	 */
	removeDeadMobiles() {
		for (let id in this._mobiles) {
			if (this._mobiles[id].isDead()) {
				this.destroyMobile(id);
			}
		}
	}

    // Les mutateurs permettent de modifier l'etat du jeu

    /**
     * Création d'une instance Player et chargement des données initiale
     * @param id
	 * @param playerData {object} données persistante du joueur
	 *
     */
    async createPlayer(id, playerData) {
		let location = playerData.location;
		let x = location.x;
		let y = location.y;
		let angle = location.angle;
		let area = await this.getArea(location.area);
        let p = new Player();
        p.id = id;
        p.status = STATUS.UNIDENTIFIED;
        this._players[id] = p;
        // obtenir et remplir la location
        // en cas d'absence de location, en créer une a partir de la position de départ du niveau
        p.location.position().set(x, y);
        p.location.heading(angle);
        p.location.area(area);
        // données du personnage
        p.character = playerData.character;
		return p;
    }

	/**
     * Création d'un mobile, cela peut etre un PNJ ou un missile
     * @param id {string} identifiant
     * @param ref {string} référence du blueprint
     * @param location {Location}
	 * @param extra {*}
	 * - speed: vitesse lors d'un mouvement (un missile est toujour en mouvement...)
	 * - type : 'missile' ; 'player' ; 'mobile' ; 'vfx'
     * @return {Mobile}
	 */
	createMobile(id, ref, location, extra) {
		if (!extra) {
			extra = {};
		}
        let m = new Mobile();
        this._mobiles[id] = m;
        m.id = id;
        m.location.assign(location);
        m.blueprint = ref;

        // il faut merger les data contenu dans blueprints
		let oBlueprint = this._resourceLoader.loadResourceSync('b', ref);
		m.data = Object.assign({}, oBlueprint, extra);
        let area = m.location.area();
        let players = this.getAreaPlayers(area).map(p => p.id);

        // initialiser l'inertie (si jamais on doit transmettre une vitesse initiale
		let angle = m.location.heading();
		if (!('speed' in m.data)) {
			throw new Error('no initial speed defined for mobile #', id);
		}
		let fInitialSpeed = m.data.speed;
		let vInertia = GeometryHelper.polar2rect(angle, fInitialSpeed);
		m.inertia().set(vInertia.dx, vInertia.dy);

        this._events.emit('mobile.created', { players, mobile: m });
        return m;
    }


    /**
     * Génère un missile
     * @param ref
     * @param oOwner
     * @param data
     * - speed : vitesse du missile
     */
    spawnMissile(ref, oOwner, data) {
        let location = oOwner.location;
        let idMissile = uniqid();
        data.type = RC.mobile_type_missile;
        let oMissile = this.createMobile(idMissile, ref, location, data);
        // il faut donner de la vitesse au missile ; c'est important pour que le client anime correctement le missile
        let th = new MissileThinker();
        th.mobile(oMissile);
        th.owner = oOwner;
        oMissile.thinker(th);
        oMissile.flagCrash = true;
        let angle = location.heading();
        let v = GeometryHelper.polar2rect(angle, oMissile.data.speed);
        th.setMovement({a: angle, sx: v.dx, sy: v.dy});
        return oMissile;
    }


    destroyMobile(id) {
		let mobile = this._mobiles[id];
		if (mobile) {
			let area = mobile.location.area();
			let players = this.getAreaPlayers(area).map(p => p.id);
			mobile.finalize();
			this._events.emit('mobile.destroyed', { players, mobile });
		}
		delete this._mobiles[id];
	}

    /**
     * Ajoute un level à la liste des zones
     * @param id {string} identifiant de la zone
     * @param area {Area} instance de la zone
     */
    linkArea(id, area) {
	    this._areas[id] = area;
    }


	/**
	 * Rejoue les movement du client pour mise en conformité
	 * {id, lt, a, sx, sy, c}
	 * retransmet à tous les client de la zone la position de ce client
	 * quand le serveur recois un ensemble de paquets il faut les jouer
	 */
	playClientMovement(idm, {t, a, x, y, sx, sy, id, c}) {
		let mobile = this._mobiles[idm];
		let loc = mobile.location;
		loc.heading(a);
		mobile.thinker().setMovement({t, a, x, y, sx, sy, id, c});
		if (c) {
			// les command sont envoyée en tant qu'évènement
			// décomposer...
			for (let i = 1; i <= COMMANDS.LAST_COMMAND; i <<= 1) {
				if (c & i) {
                    this._events.emit(EVENTS.MOBILE_COMMAND, {mobile, command: i});
				}
			}
		}
		let pos = loc.position();
		let spd = mobile.inertia();
		return {
			a: loc.heading(),
			x: pos.x,
			y: pos.y,
			sx: spd.x,
			sy: spd.y,
			id: id
		};
	}



// #    #   ####   ######           ####     ##     ####   ######   ####
// #    #  #       #               #    #   #  #   #       #       #
// #    #   ####   #####           #       #    #   ####   #####    ####
// #    #       #  #               #       ######       #  #            #
// #    #  #    #  #               #    #  #    #  #    #  #       #    #
//  ####    ####   ######           ####   #    #   ####   ######   ####

    // fonction appelée par les services pour indiquer des cas d'utilisation
    // généralement des action du client

	/**
	 * Le client est pret à télécharger le niveau dans lequel il est sensé se rendre
	 * @param client
	 * @returns {Promise<void>}
	 */
	async clientWantsToLoadLevel(client) {
		// transmettre la carte au client
        let id = client.id;
        let p = this._players[id];
        if (!p) {
			let playerData = await this._resourceLoader.loadClientData(client.name);
			p = await this.createPlayer(id, playerData);
			logger.logfmt(STRINGS.game.player_created, id);
			this._players[id] = p;
        }
        let area = p.location.area();
        logger.logfmt(STRINGS.game.player_downloading_area, id, area.name);
        let live = {
        	doors: area.getDoorState()
		};
        return {area, live};
	}

    /**
     * ### use case Client Has Loaded Level
     * le client a fini de charger son niveau
     * il faut lui transmettre l'état dynamique du niveau :
     * position de tous les mobiles
     * il faut transmettre aux autres client la position du nouveau
     */
    clientHasLoadedLevel(client) {
    	let id = client.id;
        let p = this._players[id];
        let area = p.location.area();

        // p.character contient des données spéciale gameplay


        // transmettre la position de tous les mobiles
        let mobiles = Object
            .values(this._mobiles)
            .filter(px => px.location.area() === area && px.id !== id);
        let subject = this.createMobile(
        	id,
			p.character.blueprint,
			p.location,
			{ // données supplémentaires
				type: RC.mobile_type_player,
			}
		);
        let oThinker = new TangibleThinker();
		oThinker.game(this);
		subject.thinker(oThinker);
		oThinker.mobile(subject);

		// définir quelques variables


        // déterminer la liste des joueur présents dans la zone
		let players = this.getAreaPlayers(area).filter(p => p.id !== id).map(p => p.id);
        return {
        	subject,
			mobiles,
			players
		};
    }

	clientHasLeft(client) {
    	let id = client.id;
		this.destroyMobile(id);
		delete this._players[id];
	}
}

module.exports = Core;