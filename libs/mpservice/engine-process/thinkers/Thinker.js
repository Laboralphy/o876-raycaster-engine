module.exports = class Thinker {
	constructor() {
		this._state = 'idle';
		this._duration = 0;
		this._nextState = 'idle';
		this._mobile = null;
		this._game = null;
	}

	get mobile() {
		return this._mobile;
	}

	set mobile(value) {
		this._mobile = value;
	}

	get game() {
		return this._game;
	}

	set game(value) {
		this._game = value;
	}

	/**
	 * Invoke un methode si elle est présente dans l'instance
     * @param sMeth
     */
	invoke(sMeth) {
		if (sMeth in this) {
			this[sMeth]();
		}
	}

    /**
	 * Définit un état idle
     */
	idle() {
		this.state('idle');
	}

	get duration() {
		return this._duration;
	}

    /**
	 * Permet de définir la durée de l'état avant de repasser à un autre état
     * @param value {number}
     */
	set duration(value) {
		return this._duration = value;
	}

    /**
	 * Le prochain ettat une fois que celui en cour sera terminé
     * @param s {string} state
	 * @param d {number} duration
     * @return {*}
     */
	next(s, d = Infinity) {
        this._nextState = s;
        this._duration = d;
	}

    /**
	 * modification de l'état
     * @param s {string}
     */
    state(s) {
        this.next('idle');
        this.invoke('$' + this._state + '_exit');
        this._state = s;
        this.invoke('$' + this._state + '_enter');
        return this;
    }

	think() {
		this.invoke('$' + this._state);
		if (--this._duration <= 0) {
			this._duration = Infinity;
			this.state(this._nextState);
		}
	}


	$idle() {

	}
};