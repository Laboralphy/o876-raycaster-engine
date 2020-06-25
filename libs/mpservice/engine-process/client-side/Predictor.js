/**
 * La classe implemente un système de prédiction de mouvement
 * Les changement de mouvement son transmis
 * Mise en tampon
 */
import o876 from '../../o876';

const MAX_UPDATE_TIME = 25; // Délai au dela duquel il faut mettre à jour

class Predictor {
	constructor() {
		this._id = 0;
		this._packets = [];
		this._nextPacket = null; // ce paquet sera envoyer dès que MIN_UPDATE_TIME sera périmé
	}

	/**
	 * Supprime tous les packets
	 */
	clear() {
		this._packets = [];
	}

	/**
	 * getter/setter de packets
	 * Renvoie l'ensemble des paquets
	 * @param p
	 * @returns {*}
	 */
	packets(p) {
		return o876.SpellBook.prop(this, '_packets', p);
	}

	/**
	 * Renvoie le dernier packet transmis
	 * @returns {{t, a, x, y, ma, ms, v}|null}
	 */
	lastPacket() {
		return this._packets.length > 0 ? this._packets[this._packets.length - 1] : null;
	}

	/**
	 * Empile un mouvement dans la liste, à condition qu'il y ait un changement "significatif" dans les données
	 * la function renvoie "true" si le mouvement doit être transmit au serveur;
	 * @param a {number}
	 * @param x {number}
	 * @param y {number}
	 * @param sx {number}
	 * @param sy {number}
	 * @param c {number} une commande spéciale d'action (tir, activation, utilisation d'un obj)
	 */
	pushMovement({a, x, y, sx, sy, c}) {
		let last = this.lastPacket();
		let bNoPreviousPacket = !last; // si true alors : c'est le premier packet, y'en n'a pas d'autre
		let bPush = false;
		if (bNoPreviousPacket) {
			bPush = true;
		} else if (last.t >= MAX_UPDATE_TIME || a !== last.a || sx !== last.sx || sy !== last.sy || c) {
			// packet très différent du précédent ou ...
			// précédent packet trop ancien ou ..
			// commande "c" différente du précédent ou ...
			// premier packet de la serie alors
			// on push
			bPush = true;
		} else {
			// réutilisation du packet précédent
			++last.t;
		}
		if (bPush) {
			let packet = {
				t: 1,		// iteration max
				a, x, y, 	// angle, position
				sx, sy, 	// vitesse aux axes
				id: ++this._id,  // identifiant seq
				c, 				// commandes
				s: false,		// a été envoyé ? oui/non
			};
			this._packets.push(packet);
			return packet;
		}
		return false;
	}

	/**
	 * ATTENTION !!
	 * cette fonction modifie le flag "sent" de chaque packet
	 * @returns {T[]}
	 */
	getUnsentPackets() {
		let aPackets = this._packets.filter(p => !p.s);
		aPackets.forEach(p => p.s = true);
		return aPackets;
	}

	/**
	 * Envoie des données au serveur en ne gardant que l'esse ntiel et en ajout un indicateur de durée de chaque mouvement
	 * Comme cette fonction utilise getUnsentPacket, cela modifie le flag "sent" de chaque packet
	 */
	getContiguousPackets() {
		// s'il y a plusieurs packet on va pouvoir effectuer des estimation de la durée de chaque paquet
		/*let lastTime;
		let p = this.getUnsentPackets().map(({t, a, x, y, sx, sy, id}) => {
			return {t: }
		});*/

	}

	/**
	 * Supprimer les id inférieurs à celui spécifié
	 * on ne supprime pas le dernier packet
	 * @param id
	 */
	flush(id) {
		let iLast = this._packets.length - 1;
		this._packets = this._packets.filter((p, i) => p.id > id || i === iLast);
	}

	getPacketsAfter(id) {
		return this._packets.filter(p => p.id > id);
	}

}


export default Predictor;