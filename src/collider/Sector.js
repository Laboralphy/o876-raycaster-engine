/**
 * Classe enregistrant les mobile qui s'aventure dans un secteur particulier
 * du monde. LEs Mobile d'un même secteurs sont testé entre eux pour savoir
 * Qui entre en collision avec qui. */
class Sector {
    constructor() {
        this._objects = [];
        this.x = -1;
        this.y = -1;
    }

    objects() {
        return this._objects;
    }

    add(oObject) {
        this._objects.push(oObject);
    }

    remove(oObject) {
        let objects = this._objects;
        let n = objects.indexOf(oObject);
        if (n >= 0) {
            objects.splice(n, 1);
        }
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

    /** Renvoie les objets qui collisione avec l'objet spécifié */
    collides(oObject) {
        return this._objects
            .filter(function(o) {
                return o !== oObject &&
                    oObject.hits(o)
            });
    }
}

export default Sector;
