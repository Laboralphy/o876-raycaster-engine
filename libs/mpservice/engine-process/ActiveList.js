class ActiveList {
	constructor() {
		this.items = [];
	}

	/**
	 * Renvoie true si l'élement spécifié est déja dans la liste
	 * @param item
	 * @returns {boolean}
	 */
	isLinked(item) {
		return this.items.indexOf(item) >= 0;
	}

	/**
	 * Liaison d'un item à la liste
	 * @param item
	 * @returns {number}
	 */
	link(item) {
		if (!this.isLinked(item)) {
			return this.items.push(item);
		}
	}

	/**
	 * Suppression d'un item de la liste
	 * Ou de tous les items dont la fonction done() renvoie true.
	 * @param item
	 */
	unlink(item) {
		if (Array.isArray(item)) {
			item.forEach(i => this.unlink(i));
		} else {
			let index = this.items.indexOf(item);
			if (index >= 0) {
				this.items.splice(index, 1);
			}
		}
	}
}

module.exports = ActiveList;