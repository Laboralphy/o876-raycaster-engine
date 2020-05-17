/**
 * Thinker du personnage controlé par le joueur
 */
import FPSThinker from './FPSThinker';
import COMMANDS from '../../../consts/commands'

class PlayerThinker extends FPSThinker {

	constructor() {
		super();
		this.defineKeys({
			df : ['z', 'w'],
			db : 's',
			dl : ['q', 'a'],
			dr : 'd',
			cu : ' '
		});
	}

	/**
	 * Lorsque le serveur impose une position différente de celle du client, on créé un vecteur différentiel qui
	 * s'estompe à chaque frame afin de ne pas créer de correction trop violente ce qui amenrai à des mouvement saccadé à l'écran
	 * @param x
	 * @param y
	 */
	applyCorrectionOffset(x, y) {
		let m = this._mobile;
		m.xOfs = (this.x + m.xOfs) - x;
		m.xOfs = (this.y + m.yOfs) - y;
	}

    checkCollision() {
        let m = this._mobile;
        if (m.oMobileCollision !== null) {
            let oTarget = m.oMobileCollision;
            if (oTarget.oSprite.oBlueprint.nType !== RC.OBJECT_TYPE_MISSILE) {
                m.rollbackXY();
            }
        }
    }

	$active() {
		super.$active();
		let c = 0;
		let mobile = this.mobile;
		let f = mobile.fTheta;
		let x = mobile.x;
		let y = mobile.y;
		this._aCurrentEvents.forEach(e => {
			switch (e) {
				case 'df.c':
					mobile.moveForward();
					break;

				case 'dl.c':
					mobile.strafeLeft();
					break;

				case 'dr.c':
					mobile.strafeRight();
					break;

				case 'db.c':
					mobile.moveBackward();
					break;

				case 'b0.d':
					c |= COMMANDS.PRIMARY_ACTION;
					break;

				case 'cu.d':
					c |= COMMANDS.ACTIVATE;
					break;
			}
		});
		let sx = mobile.x - x;
		let sy = mobile.y - y;

		mobile.xOfs = Math.abs(mobile.xOfs) < 1 ? 0 : mobile.xOfs * 0.5;
		mobile.yOfs = Math.abs(mobile.yOfs) < 1 ? 0 : mobile.yOfs * 0.5;
		this._game.netUpdatePlayerMobile(f, x, y, sx, sy, c);
	}
}

export default PlayerThinker;