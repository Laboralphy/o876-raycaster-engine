/**
 * Permet de composer une carte compréhensible par le raycaster
 * Ceci peut servir de base à un générateur aléatoire de niveau afin de produire le niveau final transmissible aux clients
 * et analysable par l'objet Area
 */
const o876 = require('../o876/index');


module.exports = class Level {


	constructor() {
		this._aliases = {};
		this._map = {
			lower: new o876.structures.Grid(),
			upper: new o876.structures.Grid(),
		};
		this._map.lower.on('rebuild', data => data.cell = {
			phys: 0,
			offs: 0,
			text: 0
		});
		this._map.upper.on('rebuild', data => data.cell = {
			phys: 0,
			offs: 0,
			text: 0
		});
		this._visual = {
			ceilColor: {
				r: 0,
				g: 0,
				b: 0
			},
			fogColor: {
				r: 0,
				g: 0,
				b: 0
			},
			floorColor: {
				r: 0,
				g: 0,
				b: 0
			},
			fogDistance: 1,
			light: 100,
			diffuse: 0,
			filter: false,
		};
		this._walls = {
			src: '',
			codes: [null]
		};
		this._flats = {
			src: '',
			codes: [null]
		};
		this._startpoint = {
			x: 416,
			y: 416,
			angle: 0
		};
		this._tiles = {};
		this._blueprints = {};
		this._objects = [];
		this._tags = [];
		this._decals = [];
		this._background = null;
		this._options = {
			stretch: false
		};
	}


    /**
	 * Défini le point de départ du niveau
     * @param pos {Vector}
     * @param heading {number}
     */
	startpoint(pos, heading) {
		if (pos === undefined) {
			return this._startpoint;
		} else {
            this._startpoint.x = pos.x;
            this._startpoint.y = pos.y;
            this._startpoint.angle = heading;
            return this;
		}
	}

	/**
	 * Getter/setter de la taille de la carte
	 * @param n
	 */
	size(n) {
		if (n === undefined) {
			return this._map.lower.width();
		} else {
            this._map.upper.width(n).height(n);
            this._map.lower.width(n).height(n);
			return this;
		}
	}

	/**
	 * Lecture modification du code complet en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param data {string} varriab
	 * @param code {number}
	 * @return {this|number}
	 */
	map(level, x, y, data, code) {
		if (Array.isArray(x)) {
			if (x.length !== this.size()) {
				throw new Error('')
			}
			x.forEach(
				(row, iy) => (Array.isArray(row) ? row : row.split('')).forEach(
					(cell, ix) => this.map(level, ix, iy, cell)
				)
			);
			return this;
		}
		if (code === undefined) {
			if (data in this._aliases) {
				let a = this._aliases[data];
                this._map[level].cell(x, y).wfid = a.wfid;
                this._map[level].cell(x, y).phys = a.phys;
                this._map[level].cell(x, y).offs = a.offs;
                return this;
            } else {
				let cell = this._map[level].cell(x, y);
				if (data in cell) {
					return cell[data];
				} else {
					throw new Error('invalid alias or property : "' + data + '"');
				}
            }
		} else {
			this._map[level].cell(x, y)[data] = code;
			return this;
		}
	}

	/**
	 * Lecture modification du code texture en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param code {number}
	 * @return {this|number}
	 */
	wfid(level, x, y, code) {
		return this.map(level, x, y, 'wfid', code);
	}

	/**
	 * Lecture modification du code physique en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param code {number}
	 * @return {this|number}
	 */
	phys(x, y, code) {
		return this.map(level, x, y, 'phys', code);
	}

	/**
	 * Lecture modification de l'offset en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param code {number}
	 * @return {this|number}
	 */
	offs(x, y, code) {
		return this.map(level, x, y, 'offs', code);
	}

	/**
	 * Définition d'une nouvelle tile
	 * @param sTile {string}
	 * @param data {*}
	 */
	tile(sTile, data) {
		this._tiles[sTile] = data;
	}

	/**
	 * Définition d'une nouveau blueprint
	 * @param sBP {string}
	 * @param data {*}
	 */
	blueprint(sBP, data) {
		this._blueprints[sBP] = data;
	}

	/**
	 * Ajout d'un tag
	 * @param x {number} coordonnées du tag
	 * @param y {number}
	 * @param tag {string}
	 */
	tag(x, y, tag) {
		this._tags.push({x, y, tag});
	}

	/**
	 * Ajout d'un décal
	 * @param x {number} position du block-mur concerné
	 * @param y {number}
	 * @param side {number} coté du mur 0: nord, 1: est etc...
	 * @param tile {string} référence d'un tile existante dans "tiles"
	 */
	decal(x, y, side, tile) {
		this._decals.push({x, y, side, tile});
	}

	/**
	 * modification d'une option
	 * @param opt {string}
	 * @param val {string}
	 */
	option(opt, val) {
		this._options[opt] = val;
	}

	/**
	 * modification d'une variable visual
	 * @param sVariable {string} nom de la variable
	 * @param x {*} valeur
	 */
	visual(sVariable, x) {
		this._visual[sVariable] = sVariable.toLowerCase().include('color') ? o876.Rainbow.parse(x) : x;
		return this;
	}

	textures({walls = null, flats = null, sky = null}) {
		if (walls) {
			this._walls.src = walls;
        }
        if (flats) {
			this._flats.src = flats;
		}
		if (sky) {
			this._background = sky;
		}
		return this;
	}

	/**
	 * Définition d'un block-mur
	 */
	wall(xTextures = null, nFrames = 0, nDelay = 0, nLoop = 0) {
		if (xTextures === null) {
            return this._walls.codes.push(null);
		}
		if (typeof xTextures === 'number') {
			xTextures = [xTextures, xTextures];
		}
		if (nFrames <= 1) {
			return this._walls.codes.push(xTextures)
		} else {
            return this._walls.codes.push([xTextures, nFrames, nDelay, nLoop]);
		}
	}

	/**
	 * Définition d'un block-sol
	 */
	flat(nFloor, nCeilling) {
		nFloor = nFloor || -1;
		nCeilling = nCeilling || -1;
		if (nCeilling === -1 && nFloor === -1) {
            return this._flats.codes.push(null);
		} else {
            return this._flats.codes.push([nFloor, nCeilling]);
		}
	}

    /**
	 * Ajoute une définition combinée d'un mur et d'un flat
     * @param walldef {array<number>} defintion des textures murales
     * @param flatdef {*} definition des textures horizontales {floor, ceilling}
     * @param animdef {*} definition de l'animation des textures murale  {frames, delay, loop}
     */
	block(walldef = null, flatdef = null, animdef = null) {
		let wcode = 0, fcode = 0;
		if (walldef) {
			if (animdef) {
				wcode = this.wall(walldef, animdef.frames, animdef.delay, animdef.loop);
			} else {
                wcode = this.wall(walldef);
			}
		} else {
			wcode = this.wall();
		}
		if (flatdef) {
			fcode = this.flat(flatdef[0], flatdef[1]);
		} else {
			fcode = this.flat();
		}
		if (fcode !== wcode) {
			throw new Error('error during block definition - walls : ' + wcode + ' & flats : ' + fcode);
		}
		return wcode - 1;
	}

	/**
	 * Cette fonction permet de combiner tous les paramètres d'un block, et de l'identifier avec un alias de 1 caractère.
	 * Les alias ainsi défini peuvent permettre de dessiner facilement des niveau dans le contexte d'un level design
	 * simple.
	 * Ainsi cet alias fera référence :
	 * - au code physique,
	 * - aux textures murales et horizontale
	 * - au paramètres d'animation de textures
	 * L'alias peut être ensuite utilisé dans un mappage avec la méthode .map()
	 * @param sAlias {string} nom de l'alias (1 seul caractère)
	 * @param w {array} définition des textures murales (1, 2, ou 4 id référence texture)
	 * @param f {array} définition des textures horizontale (2 id référence texture)
	 * @param a {array} paramètre d'animation [frames, delay, loop]
	 * @param o {number} valeur de l'offset
	 * @param p {number|string} code physique
	 * @returns {module.Level}
	 */
	alias(sAlias, {w = null, f  = null, a = null, o = 0, p = 0}) {
		const DOORS = {
			"solid": 0x01,
			"door-up" : 0x02,
			"curt-up" : 0x03,
            "door-down" : 0x04,
            "curt-down" : 0x05,
            "door-left" : 0x06,
            "door-right" : 0x07,
            "door-double" : 0x08,
			"secret" : 0x09,
            "transparent" : 0x0A,
            "invisible" : 0x0B,
            "offset" : 0x0C
		};
		let phys = (typeof p === 'string') ? (DOORS[p] || 0) : p;
		let wfid = this.block(w, f, a);
		this._aliases[sAlias] = {wfid, phys, o};
		return this;
	}




	/**
	 * générer le JSON
	 * @returns {{map: *, upper: null, visual: {ceilColor: {r: number, g: number, b: number}, fogColor: {r: number, g: number, b: number}, floorColor: {r: number, g: number, b: number}, fogDistance: number, light: number, diffuse: number, filter: boolean}, walls: {src: string, codes: Array}, flats: {src: string, codes: Array}, startpoint: {x: number, y: number, angle: number}, tiles: {}, blueprints: {}, objects: Array, tags: Array, decals: Array, background: null, options: {stretch: boolean}}}
	 */
	render() {
		function cellConvert(c) {
			return (c.offs << 16) | (c.phys << 12) | c.wfid;
		}

		function rowConvert(row, y) {
			return row.map(cellConvert);
		}

		function mapConvert(map) {
			return map.map(rowConvert);
		}

		return {
			map: mapConvert(this._map.lower.cells()),
			uppermap: this
				._map
				.upper.cells()
				.some(row =>
					row.some(cell => cellConvert(cell) > 0)
				) ? mapConvert(this._map.upper.cells()) : null,
			visual: this._visual,
			walls: this._walls,
			flats: this._flats,
			startpoint: this._startpoint,
			tiles: this._tiles,
			blueprints: this._blueprints,
			objects: this._objects,
			tags: this._tags,
			decals: this._decals,
			background: this._background,
			options: this._options
		};
	}
};