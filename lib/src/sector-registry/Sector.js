/**
 * Classe enregistrant les mobile qui s'aventure dans un secteur particulier
 * du monde. Les Mobile d'un même secteurs sont testé entre eux pour savoir
 * Qui entre en collision avec qui.
 */
import ArrayHelper from "../array-helper";

class Sector {
    constructor() {
        this._objects = [];
        this.x = -1;
        this.y = -1;
    }

    get objects() {
        return this._objects;
    }

    add(oObject) {
        this._objects.push(oObject);
    }

    remove(oObject) {
        ArrayHelper.remove(this._objects, oObject)
    }

    /**
     * Renvoie le nombre d'objet enregistrer dans le secteur
     * @return int
     */
    count() {
        return this._objects.length;
    }

    /** Renvoie l'objet désigné par son rang */
    get(i) {
        return this._objects[i] || null;
    }
}

export default Sector;
