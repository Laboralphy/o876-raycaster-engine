/**
 * classe de regroupement des socket manager
 */

import ChatSocket from './ChatSocket';
import EngineSocket from './EngineSocket';
import LoginSocket from './LoginSocket';


class AdapterManager {

	constructor({socket, game}) {
		this._adapters = {};
		this.declareAdapter('login', new LoginSocket({socket, game}));
		this.declareAdapter('chat', new ChatSocket({socket, game}));
		this.declareAdapter('engine', new EngineSocket({socket, game}));
	}

	declareAdapter(sName, oInstance) {
		this._adapters[sName] = oInstance;
	}

	getAdapters() {
		return this._adapters;
	}

	getAdapter(sAdapter) {
		if (sAdapter in this._adapters) {
			return this._adapters[sAdapter];
		} else {
			throw new Error('unknown socket adapter "' + sAdapter + '"');
		}
	}
}

export default AdapterManager;