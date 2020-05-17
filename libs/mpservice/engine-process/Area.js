/**
 * Une zone du jeu:
 * Les instances de cette classe contient toutes les données de la zone
 * ainsi qu'une version exportable au format raycaster
 */
const RC_CONST = require('../consts/raycaster');

const Door = require('./Door');
const ActiveList = require('./ActiveList');
const o876 = require('../o876');
const Emitter = require('events');


module.exports = class Area {
    constructor() {
    	// identifiant
    	this.id = '';
        // nom eventuel de la zone
        this.name = '';
        // graine de génération aléatoire
        this.seed = '';
        // données initiale de la zone telle que générées par le générateur ou le level builder
        this._data = null;
        // niveau
        this._level = null;
        // carte des sections solid afin d'accelérer le calcul des collision murale
        this._physicMap = null;
        // liste des portes, afin de surveiller si on peut les traverser ou pas
        this._doorList = [];
        // liste des portes actives (celle qui sont en cours d'ouverture/refermeture
        this._activeDoorList = new ActiveList(); /** @todo ne gérer que les portes qui sont dans cette liste */
        // position de départ
        this._startpoint = null;
        // collider
        this._collider = new o876.collider.Collider();
        // Emitter
        this.emitter = new Emitter();
    }

    collider() {
        return this._collider;
    }

	/**
     * Commande l'ouverture d'une porte en x, y
     * Si c'est un passage secret cela commandera aussi l'ouverture du block adjacent
	 * @param x
	 * @param y
	 */
	openDoor(x, y) {
		let oCell = this.getCell(x, y);
        let oDoor = oCell ? oCell.door : null;
        if (oDoor) {
            if (oDoor.open()) {
				if (oDoor.isSecret()) {
					oDoor.nextSecretDoor = this._doorList.find(d => d.isSecret() && d.isAdjacent(oDoor));
				}
            }
        }
    }

    /**
     * Permet d'etablir l'état de toutes les porte du niveau
     * Afin que le client qui vient de charger le niveau
     * puisse correctement ouvrir ou fermer les portes comme sur le serveur
     */
    getDoorState() {
    	const adl = this._activeDoorList.items;
    	let oState = [];
		for (let d in adl) {
			let door = adl[d];
			oState.push(door.state());
		}
		return oState;
    }

	/**
     * Gestion des porte actuellement ouvertes ou entrouvertes
	 */
	processDoors() {
	    let aDoneDoors = this._activeDoorList.items.filter(door => door.process());
		this._activeDoorList.unlink(aDoneDoors);
    }

    level(l) {
	    if (l === undefined) {
	        return this._level;
        } else {
	        this._level = l;
	        this.data(l.render());
	        return this;
        }
    }

    /**
     * Fabrique la carte des zones solides
     */
    data(d) {
        if (d === undefined) {
            return this._data;
        } else {
            this._data = d;
            this._collider
                .width(d.map.length)
                .height(d.map.length)
                .cellWidth(RC_CONST.plane_spacing)
                .cellHeight(RC_CONST.plane_spacing);
            this._physicMap = d.map.map((row, y) => row.map((cell, x) => {
                return {
                    area: this,
                    x,
                    y,
                    code: (cell & 0x0000F000) >> 12,
                    door: null
                };
            }));
            this._physicMap.forEach((row, y) => row.forEach((cell, x) => {
                if (cell.code >= RC_CONST.phys_first_door && cell.code <= RC_CONST.phys_last_door) {
                    let oDoor = new Door();
                    oDoor.setDoorType(cell.code);
                    // pour les porte, on complete l'instance
                    oDoor.x = x;
                    oDoor.y = y;
                    cell.door = oDoor;
                    this._doorList.push(oDoor);
                    oDoor.events.on('opening', door => {
                        this._activeDoorList.link(door);
                        this.emitter.emit('door.open', {door});
                    });
                    oDoor.events.on('closing', door => {
                        this.emitter.emit('door.close', {door});
                    })
                }
            }));
            this._startpoint = d.startpoint;
            return this;
        }
    }

    _checkRange(a, x) {
    	return x >= 0 && x < a.length;
	}

    /**
     * Renvoie le block de la carte physique, dont les coordonnées sont spécifiées
     * @param x
     * @param y
     * @return {*}
     */
    getCell(x, y) {
    	let pm = this._physicMap;
		if (this._checkRange(pm, y) && this._checkRange(pm[y], x)) {
			return pm[y][x];
		} else {
			throw new Error('this cell does not exist (' + x + ', ' + y + ')');
		}
	}

    /**
     * Renvoie true si le block spécifié est solide
     * c'est à dire que personne ne peut le traverser
     * cette methode prend en compte les porte et leur état
     */
    isSolid(x, y) {
        let pm = this.getCell(x, y);
        switch (pm.code) {
            case RC_CONST.phys_none:
                return false;

            case RC_CONST.phys_wall:
            case RC_CONST.phys_secret_block:
            case RC_CONST.phys_transparent_block:
            case RC_CONST.phys_invisible_block:
            case RC_CONST.phys_offset_block:
                return true;

            default:
                return pm.door.isSolid();
        }
    }

    isSolidPoint(x, y) {
        if (isNaN(x) || isNaN(y)) {
            throw new Error('solid point function has found an error : ' + x + ':' + y);
        }
    	return this.isSolid(
    		x / RC_CONST.plane_spacing | 0,
			y / RC_CONST.plane_spacing | 0
		);
	}
};