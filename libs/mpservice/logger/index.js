const util = require('util');

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


    /**
	 * Même chose que log mais prend en premier argument la chaine formatable
	 * et les argument suivant seront les arguments de cette chaine
     */
	logfmt(sString, ...values) {
		this.log(util.format(sString, ...values));
	}

    /**
     * Même chose que logfmt mais pour les erreur
     */
    errfmt(sString, ...values) {
        this.err(util.format(sString, ...values));
    }
}

module.exports = new Log();