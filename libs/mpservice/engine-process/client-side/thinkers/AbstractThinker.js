import o876 from '../../../o876/index';
import NodeThinker from '../../thinkers/Thinker';

class AbstractThinker extends NodeThinker {
	constructor() {
		super();
		this._mobile = null;
		this._game = null;
		this._info = {
			id: '',
			x: 0,
			y: 0,
			angle: 0
		};
	}

	/**
	 * Rassemble les information de ce mobile, de manière à pouvoir les proposer à d'autre composant du jeu
	 * comme le HUD.
	 */
	info() {
		let info = this._info;
		let m = this._mobile;
		info.id = m.id;
		info.x = m.x;
		info.y = m.y;
		info.angle = m.fTheta;
		return info;
	}

    mobile(m) {
        return o876.SpellBook.prop(this, '_mobile', m);
    }

    game(m) {
        return o876.SpellBook.prop(this, '_game', m);
    }
}

export default AbstractThinker;