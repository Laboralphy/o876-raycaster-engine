import AbstractThinker from './AbstractThinker';
import RC from '../../../consts/raycaster';

/**
 * Ce thinker permet de bouger un mobile en définissant un vecteur de vitesse.
 * Il ne dispose d'aucune intelligence artificielle Ce thinker a été conçu pour
 * être utilisé comme Thinker de base dans un environnement réseau.
 */
class NetThinker extends AbstractThinker {

	constructor() {
		super();
		this.fma = 0; // Moving angle
		this.fms = 0; // Moving Speed
		this.state('alive');
	}

	/**
	 * Modification du mouvement/position du mobile
	 * @param a {number} nouvel angle de visée
	 * @param x {number} coordonnée x
	 * @param y {number} coordonnée y
	 * @param sx {number} vitesse selon axe x
	 * @param sy {number} vitesse selon axe y
	 * @param f {array} ensemble de vecteurs de répulsion
	 */
	setMovement(a, x, y, sx, sy, f) {
		this.mobile.setXY(x, y);
		let fMovSpeed =
			sy === undefined ?
				sx :
				Math.sqrt(sx * sx + sy * sy);
		let fMovAngle = Math.atan2(sy, sx);
		let mobile = this.mobile;
		if (this.fma !== a || this.fms !== fMovSpeed) {
			this.fma = fMovAngle;
			this.fms = fMovSpeed;
			let oSprite = mobile.oSprite;
			let nAnim = oSprite.nAnimationType;
			let bStopped = fMovSpeed === 0;
			mobile.fTheta = a;
			// déterminer l'animation à jouer selon les changements de mouvement
			switch (nAnim) {
				case RC.animation_action:
				case RC.animation_stand:
					// le mobile était à l'arret, il faut qu'il bouge -> animation walk
					if (!bStopped) {
						oSprite.playAnimationType(RC.animation_walk);
					}
					break;

				case RC.animation_walk:
					// le mobile était en déplacement, il faut qu'il s'arrete -> animation stand
					if (bStopped) {
						oSprite.playAnimationType(RC.animation_stand);
					}
					break;
			}
		}
	}

	die() {
		this.state('dying');
	}

	disable() {
		this.state('disable');
	}

	restore() {
		this.mobile.bEthereal = false;
		this.state('alive');
	}

	$alive() {
		let m = this.mobile;
		m.move(this.fma, this.fms);
		if (this.game.oRaycaster.clip(m.x, m.y, 1)) {
			m.rollbackXY();
		}
	}

	$disable() {
		this.state('dead');
	}

	$dying_enter() {
		let m = this.mobile;
		this.setMovement(this.fma, m.x, m.y, 0, 0);
		m.oSprite.playAnimationType(RC.animation_death);
		let nDeadTime = m.oSprite.oAnimation.nDuration * m.oSprite.oAnimation.nCount / this.game.TIME_FACTOR | 0;
		this.next('dead', nDeadTime);
		m.bEthereal = true;
	}

	$dying() {
	}

	$dead_enter() {
		let m = this.mobile;
		m.gotoLimbo();
		m.bActive = false;
	}

	$dead() {
		// quand c'est mort, c'est mort pour de bon
	}
}


export default NetThinker;