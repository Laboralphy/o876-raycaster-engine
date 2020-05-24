const MoverThinker = require('./MoverThinker');
const RC = require('../../consts/raycaster');
const Vector = require('../../../geometry/Vector');

/**
 * Gestion du déplacement des missile
 */
class MissileThinker extends MoverThinker {
	constructor() {
		super();
		this.owner = null;
	}

    /**
	 * Vérifie si on collisionne un mobile
     */
	checkMobileCollisions() {
		let owner = this.owner;
		let aMobHits = this._mobile.getCollidingMobiles().filter(m => m !== owner);
		// tous les mobiles sus mentionnés se prennent le missile dans la courge.
		if (aMobHits.length) {
            this.state('explode');
		}
	}

	checkWallCollisions() {
        let mobile = this._mobile;
        if (mobile.hasHitWall()) {
            // il y a eu collision
            this.state('explode');
        }
	}

	$move() {
		super.$move();
        this.checkMobileCollisions();
		this.checkWallCollisions();
	}

	$explode_enter() {
		this.mobile.die();
	}
}


module.exports = MissileThinker;