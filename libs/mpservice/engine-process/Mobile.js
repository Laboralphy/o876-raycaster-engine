/**
 * Gestion d'une entité mobile dans le labyrinthe
 * Collision
 * Décision
 */

const o876 = require('../o876/index');
const Vector = o876.geometry.Vector;
const RC_CONST = require('../consts/raycaster');
const Location = require('./Location');
const ForceField = require('./ForceField');

const FORCE_NORM = 10;


module.exports = class Mobile {
	constructor() {
        // identifiant
		this.id = '';
		// flag de death
		this._dead = false;
		// position & angle
		this.location = new Location();
		// vitesse de déplacement
		this._inertia = new Vector(0, 0); // ce vecteur est rétro-renseignée d'après computeWallcollision
		// ensembles des forces appliquées au mobiles
		this._size = 16;
		this.wallCollision = {
			x: 0,
			y: 0,
			c: false
		};
		this._dummy = null;
		this._thinker = null;
		// aspect
		this.blueprint = '';
		this.data = {};
		// flags
		this.flagCrash = false; // ne glisse pas sur les mur ; explose.
		this.forceField = new ForceField();
		this.bUnderForceEffect = false;
	}

	die() {
		this._dead = true;
	}

	isDead() {
		return this._dead;
	}

	/**
	 * Permet de supprimer le mobile du collisionner
	 */
	finalize() {
		let cm = this._dummy;
		if (cm) {
			cm.dead(true);
            this.collider().track(cm);
			this._dummy = null;
		}
	}

	/**
	 * setter/getter du collisionneur
	 * @returns {*}
	 */
	collider() {
		return this.location.area().collider();
	}

    /**
     * Défini la taille physique du mobile, pour les collisions
     * @param n {number}
     */
	size(n) {
		return o876.SpellBook.prop(this, '_size', n);
	}

	inertia(v) {
		return o876.SpellBook.prop(this, '_inertia', v);
	}

	thinker(th) {
		return o876.SpellBook.prop(this, '_thinker', th);
	}

	think() {
		this._thinker.think();
	}

	hasHitWall() {
		return this.wallCollision.c;
	}

    /**
	 * Applique une nouvelle force a ce mobile
     * @param v {Vector}
     * @param f {number} taux de maintient de cette force, si proche de 1, ce vecteur de force ne s'epuise pas
	 * si proche de zero, le vecteur force s'epuise presque instantanément.
     */
	force(v, f) {
		this.forceField.force(v, f, {n: true});
	}

	hasForces() {
		return this.forceField.forces().length;
	}

	/**
	 * fait appliquer les forces en bougeant le mobile
	 * toutes les forces diminuent d'intensité selon leur facteur
	 * les forces devenue trop faible (moins de 1% de leur intensité initiale), disparraissent
	 */
	applyForces() {
		let ff = this.forceField;
		let f = ff.computeForces();
		if (f.x !== 0 || f.y !==  0) {
			this.move(f);
			this.thinker().changeMovement();
			this.bUnderForceEffect = true;
		} else if (this.bUnderForceEffect) {
			// nous étions toujours sous influence de forces, mais celles ci viennent de retomber à zero
			// indiquer néanmoins les changement un e dernière fois
			this.bUnderForceEffect = false;
			this.thinker().changeMovement();
		}
		ff.reduceForces();
	}

	/**
	 * Détermine la collision entre le mobile et les murs du labyrinthe
	 * @typedef {Object} xy
	 * @property {number} x
	 * @property {number} y
	 *
	 * @param vPos {Vector} position du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param vSpeed {Vector} delta de déplacement du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param nSize {number} demi-taille du mobile
	 * @param nPlaneSpacing {number} taille de la grille
	 * (pour savoir ou est ce qu'on s'est collisionné). ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
	 * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
	 */
	static computeWallCollisions(vPos, vSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction) {
		// par defaut pas de colision détectée
		let oWallCollision = {x: 0, y: 0, c: false};
		let dx = vSpeed.x;
		let dy = vSpeed.y;
		let x = vPos.x;
		let y = vPos.y;
		// une formule magique permettant d'igorer l'oeil "à la traine", evitant de se faire coincer dans les portes
		let iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
		let xClip, yClip, ix, iy, xci, yci;
		let bCorrection = false;
		// pour chaque direction...
		for (let i = 0; i < 4; ++i) {
			// si la direction correspond à l'oeil à la traine...
			if (iIgnoredEye === i) {
				continue;
			}
			// xci et yci valent entre -1 et 1 et correspondent aux coeficients de direction
			xci = (i & 1) * Math.sign(2 - i);
			yci = ((3 - i) & 1) * Math.sign(i - 1);
			ix = nSize * xci + x;
			iy = nSize * yci + y;
			// déterminer les col
			xClip = pSolidFunction(ix + dx, iy);
			yClip = pSolidFunction(ix, iy + dy);
			if (xClip) {
				oWallCollision.c = true;
				dx = 0;
				if (bCrashWall) {
					dy = 0;
					oWallCollision.y = yci || oWallCollision.y;
				}
				oWallCollision.x = xci || oWallCollision.x;
				bCorrection = true;
			}
			if (yClip) {
				oWallCollision.c = true;
				dy = 0;
				if (bCrashWall) {
					dx = 0;
                    oWallCollision.x = xci || oWallCollision.x;
				}
				oWallCollision.y = yci || oWallCollision.y;
				bCorrection = true;
			}
		}
		x += dx;
		y += dy;
		if (bCorrection) {
			// il y a eu collsion
			// corriger la coordonée impactée
			if (oWallCollision.x > 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.x < 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
			if (oWallCollision.y > 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.y < 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
			return {
				pos: new Vector(x, y),
				speed: new Vector(x - vPos.x, y - vPos.y),
				wcf: oWallCollision
			};
		} else {
			return {
				pos: new Vector(x, y),
				speed: new Vector(dx, dy),
				wcf: oWallCollision
			}
		}
	}

	/**
	 * Mise à jour du Dummy de collision
	 * @returns {null|*}
	 */
	dummy() {
		let cm;
        if (!this._dummy) {
            cm = new o876.collider.Dummy();
            cm._mobile = this;
            cm._tangibility = this.data.tangibility;
            this._dummy = cm;
        } else {
            cm = this._dummy;
		}
		cm.radius(this._size);
		cm.position(this.location.position());
		this.collider().track(cm);
		return cm;
	}

	getCollidingMobiles() {
        return this.collider().collides(this.dummy()).map(d => d._mobile);
	}

	computeCollidingForces(aMobHits) {
        let vPos = this.location.position();
        let x = vPos.x;
        let y = vPos.y;
        let dist = o876.geometry.Helper.distance;
        // ajouter un vecteur force à tous ces mobiles
        return aMobHits.map(m => {
        	let mPos = m.location.position();
        	let mx = mPos.x;
        	let my = mPos.y;
            return this.force(
                vPos.sub(m.location.position())
                    .normalize()
                    .scale((this._size + m._size - dist(x, y, mx, my)) / 2),
                0
            )
        });
	}


    /**
     * Teste si le mobile spécifié entre en collision avec un autre mobile.
     */
    computeMobileCollisions() {
    	let aMobHits = this.getCollidingMobiles();
    	let aForces = this.computeCollidingForces(aMobHits);
    	// aForces est la liste des force engendrée par la collision
		return !!aMobHits.length;
    }

    /**
	 * Déplace le mobile selon le vector spécifié
	 * Ceci est un déplacement ponctuel
	 * Gestion des collisions
	 * @param {Vector} vSpeed
	 */
	move(vSpeed) {
		let oLocation = this.location;
        let vPos = oLocation.position();
        let area = oLocation.area();

        //let nDist = vSpeed.distance();
        let nSize = this._size;
        let nPlaneSpacing = RC_CONST.plane_spacing;
        let bCrashWall = this.flagCrash;
        let r;
        r = Mobile.computeWallCollisions(
            vPos,
            vSpeed,
            nSize,
            nPlaneSpacing,
            bCrashWall,
			(x, y) => area.isSolidPoint(x, y)
        );
		this.inertia().translate(r.speed);
		vPos.set(r.pos);
        this.wallCollision = r.wcf;
	}

};