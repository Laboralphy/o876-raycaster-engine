/**
 * Le Mover Thinker permet d'interpoler les movement des joueurs
 * Chaque joueur envoie des données de modif de mouvement de temps à autres
 * Ce Thinker permet à chaque frame de calculer la position exacte du mobile et
 * d'effectuer des calcul de collision avec les murs.
 */
const Thinker = require('./Thinker');
const Vector = require('libs/geometry/Vector');

module.exports = class MoverThinker extends Thinker {
	constructor() {
		super();
		this._speed = new Vector(); // véritable vitesse qui controle le déplacement du mobile
		this._angle = 0;
		this._bHasChangedMovement = true;
		this.state('move');
	}

	$move() {
		let m = this._mobile;
		m.inertia().set(0, 0);
		m.location.heading(this._angle);
		m.move(this._speed);
	}

	/**
	 * Renvoie true si le mobile à modifié son mouvement
	 *  = si sa vitesse aux axes, ou son angle de cap ont changé de valeur
	 */
	hasChangedMovement() {
		let b = this._bHasChangedMovement;
		this._bHasChangedMovement = false;
		return b;
	}

    /**
	 * indique que le mobile a vu la course naturelle de son movement etre modifiée
	 * soit par un changement dans les controles utilisateur
	 * soit par des force externes (explosions... repulsions...)
     */
	changeMovement() {
        this._bHasChangedMovement = true;
	}

	getMovement() {
		let m = this._mobile;
		let loc = m.location;
		let pos = loc.position();
		let spd = m.inertia();
		return {
			id: m.id,
			a: loc.heading(),
			x: pos.x,
			y: pos.y,
			sx: spd.x,
			sy: spd.y,
		};
	}

	setMovement({a, sx, sy}) {
		if (a !== this._angle) {
			this.changeMovement();
			this._angle = a;
		}
		if (sx !== this._speed.x || sy !== this._speed.y) {
            this.changeMovement();
			this._speed.set(sx, sy);
		}
	}
};