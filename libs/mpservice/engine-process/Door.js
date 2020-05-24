/**
 * Cette classe gère les porte et particulièrement le mécanisme de refermeture
 * Permettant de déterminer si le block de cette porte est traversable ou pas
 */

const RC_CONST = require('../consts/raycaster');

const Emitter = require('events');

class Door {
    constructor() {
        this.events = new Emitter();
        // offset de la porte 0 = fermé
        this.nOffset = 0;
        // lorsque l'offset atteind cette valeur la porte est traversable
        this.nOffsetOpen = 64;
        // etat de la porte
        // 0:fermé
        // 1:en cours d'ouverture
        // 2:ouvert et traversable
        // 3:en cours de fermeture
        this.nState = 0;
        // si true alors la porte se referme au bout d'un certain délai
        this.bAutoclose = false;
        // delai au bout duquel la porte se referme
        this.nAutocloseDelay = Infinity;
        // temps qui sert a déterminer le moment ou la porte se referme
        // lorsque la valeur tombe à zero, il est temps de refermer la porte
        this.nAutocloseTime = 0;
        // si true alors la porte est vérouillée et ne peut pas s'ouvrir
        this.bLocked = false;
        this.bObstructed = false; // obstruction externe de la porte : elle ne peut pas se refermer
        // type de porte
        // h1 : porte 1 battant ouverture horizontale
        // h2 : porte 2 battants ouverture horizontale
        // v : porte à ouverture verticale
        this.nDoorType = 0;
        this.x = -1;
        this.y = -1;
        this.nextSecretDoor = null;
    }

    state() {
        return {
            x: this.x,
            y: this.y,
            offset: this.nOffset,
            state: this.nState
        };
    }

    /**
     * Il existe plusieurs sortes de portes ayant chacunes leurs temps d'ouverture
     * cette method permet de defini des preset
     */
    setDoorType(nType) {
        this.nDoorType = nType;
        switch (nType) {
            case RC_CONST.phys_door_sliding_left:
            case RC_CONST.phys_door_sliding_right:
                this.nOffsetOpen = RC_CONST.time_door_single_horiz / RC_CONST.time_factor;
                this.autoclose(RC_CONST.time_door_autoclose);
                break;

            case RC_CONST.phys_door_sliding_double:
                this.nOffsetOpen = RC_CONST.time_door_double / RC_CONST.time_factor;
                this.autoclose(RC_CONST.time_door_autoclose);
                break;

            case RC_CONST.phys_door_sliding_up:
            case RC_CONST.phys_door_sliding_down:
            case RC_CONST.phys_curt_sliding_up:
            case RC_CONST.phys_curt_sliding_down:
                this.nOffsetOpen = RC_CONST.time_door_single_vert / RC_CONST.time_factor;
                this.autoclose(RC_CONST.time_door_autoclose);
                break;

            case RC_CONST.phys_secret_block:
                this.nOffsetOpen =  RC_CONST.time_door_secret / RC_CONST.time_factor;
                this.autoclose(Infinity);
                break;
        }
    }

    /**
     * Définir le delai d'auto fermeture de laporte
     * si le délai est Inifini ou  alors l'autoclose est désactivé
     * @param nDelay
     */
    autoclose(nDelay) {
        this.bAutoclose = nDelay !== Infinity;
        this.nAutocloseDelay = nDelay / RC_CONST.time_factor | 0;
    }

    /**
     * Ouvre la porte sauf si celle ci est vérrouillée
     * @return {boolean} résultat de l'opération
     */
    open() {
        if (this.bLocked) {
			this.events.emit('locked', this);
            return false;
        }
        if (this.nState === 0) {
			if (this.bAutoclose) {
                this.nAutocloseTime = this.nAutocloseDelay;
            }
            this.nState = 1;
			this.events.emit('opening', this);
            return true;
        }
        return false;
    }

    /**
     * Effectue le traitement automatisé d'une porte
     */
    process() {
        let bDone = false;
        switch (this.nState) {
            case 0: // porte fermée : rien à faire
                break;

            case 1: // porte en cours d'ouverture : s'arreter si l'offset dépasse la valeur max
                if (++this.nOffset >= this.nOffsetOpen) {
                    ++this.nState;
                    if (this.bAutoclose) {
                        this.nAutocloseTime = this.nAutocloseDelay;
                    }
					this.events.emit('opened', this);
                }
                break;

            case 2: // porte ouverte, entamer la refermeture si c'est une autoclose
                // dont le delai arrive à terme
                if (this.isSecret()) {
					// les porte secrete ne se referme jamais
					bDone = true;
					if (this.nextSecretDoor) {
						this.nextSecretDoor.open();
					}
                } else if (this.bAutoclose && --this.nAutocloseTime <= 0) {
                    if (this.bObstructed) {
                        this.nAutocloseTime = this.nAutocloseDelay >> 1;
                    } else {
                        this.nAutocloseTime = 0;
                        ++this.nState;
                        this.events.emit('closing', this);
                    }
                }
                break;

            case 3: // en cours de refermeture : réinitialiser l'état quand l'offset atteint 0
                if (--this.nOffset <= 0) {
                    this.nOffset = 0;
                    this.nState = 0;
					bDone = true;
					this.events.emit('closed', this);
                }
                break;
        }
        return bDone;
    }

    isSolid() {
        return this.nOffset < this.nOffsetOpen;
    }

	/**
     * Renvoie true si la porte est un passage secret
     * @return boolean
	 */
	isSecret() {
        return this.nDoorType === RC_CONST.phys_secret_block;
    }

	/**
     * Renvoie true si la porte spécifée est adjacente à celle ci
	 * @param door
	 */
	isAdjacent(door) {
	    //   dx  dy
		//   -1  -1   2  -
		//    0  -1   1  +
		//    1  -1   2  -
		//   -1   0   1  +
		//    0   0   0  -
		//    1   0   1  +
		//   -1   1   2  -
		//    0   1   1  +
		//    1   1   2  -
		let dx = Math.abs(door.x - this.x);
		let dy = Math.abs(door.y - this.y);
        return (dx + dy) === 1;
    }
}

module.exports = Door;