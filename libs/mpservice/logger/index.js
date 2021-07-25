
class Log {

	/**
	 * Renvoie une chaine paddée de zero à gauche
	 * @param s {*}
	 * @return {string}
	 */
	static padZero(s) {
		return s.toString().padStart(2, '0');
	}

	/**
	 * Construit une chaine normalisée à partir de la date spécifiée
	 * @param dNow {Date}
	 * @return {string}
	 */
	buildDateString(dNow) {
		let sMonth = Log.padZero(1 + dNow.getMonth());
		let sDay = Log.padZero(dNow.getDate());
		let sHours = Log.padZero(dNow.getHours());
		let sMinutes = Log.padZero(dNow.getMinutes());
		let sSeconds = Log.padZero(dNow.getSeconds());
		return (['[', sMonth, '-', sDay, ' ', sHours, ':', sMinutes, ':', sSeconds, ']']).join('');
	}

	/**
	 * Log les arguments dans la sortie standard
	 */
	log(...args) {
		console.log(this.buildDateString(new Date()), ...args);
	}

    /**
	 * Imprime un message d'erreur
     */
    err() {
        console.error(this.buildDateString(new Date()), String.fromCharCode(27) + '[4m/!\\' + String.fromCharCode(27) + '[0m', ...arguments);
    }
}

module.exports = new Log();