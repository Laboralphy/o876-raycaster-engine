class ArrayHelper {
	/**
	 * Turns an array-like-structure into an array (a real one)
	 */
	static array(subject) {
		const LENGTH_PROPERTY = 'length';
		if (Array.isArray(subject)) {
			return subject;
		}
		if (typeof subject === 'object') {
			// is there a length property ?
			let bLength = LENGTH_PROPERTY in subject;
			// extracting keys minus "length" property
			let aKeys = Object
				.keys(subject)
				.filter(k => k !== LENGTH_PROPERTY);
			if (aKeys.some(k => isNaN(k))) {
				return false;
			}
			if ((bLength) && (subject[LENGTH_PROPERTY] !== aKeys.length)) {
				return false;
			}
			if (aKeys
				.map(k => parseInt(k))
				.sort((k1, k2) => k1 - k2)
				.every((k, i) => k === i)) {
				return bLength
					? Array.prototype.slice.call(subject, 0)
					: aKeys.map(k => subject[k]);
			}
		}
		return false;
	}

    /**
	 * process an input array. Dispatch all items into category-arrays, each category-array is then sorted according to another function
     * @param aInput {array}
     * @param cat {function} will be call for each aInput item, this function is expected to return a category identifier
     * @param sort {function} will be used to sort all categories
     */
	static categorize(aInput, {cat, sort = null}) {
		let oOutput = {};
		aInput.forEach(e => {
			let sCat = cat(e);
			if (!(sCat in oOutput)) {
				oOutput[sCat] = [];
			}
			oOutput[sCat].push(e);
		});
		if (typeof sort === 'function') {
			for (let sCat in oOutput) {
				oOutput[sCat] = oOutput[sCat].sort(sort)
			}
		}
		return oOutput;
	}

	/**
	 * Remove all duplicate entries in the specified array. This will not modify the array ; a new one
	 * @param aArray
	 * @returns {*}
	 */
	static uniq(aArray) {
		return aArray.filter((x, i, a) => a.indexOf(x) === i)
	}

	/**
	 * quickly clones an array into a new one
	 * this method is mainly used for turning "arguments" pseudo array into a real array
	 * @param a {Array|Object}
	 * @return {Array}
	 */
	static clone(a) {
		return Array.prototype.slice.call(a, 0)
	}


	/**
	 * returns two arrays
	 * array 'old' contains all items that are in A but not in B
	 * array 'new' contains all items that are in B but not in A
	 *
	 * @param a
	 * @param b
	 * @returns {{new: ...*[], old: ...*[]}}
	 */
	static diff(a, b) {
		const a1 = new Set(a);
		const b1 = new Set(b);
		// in a & not in b
		const notInB = [...new Set([...a].filter(x => !b1.has(x)))];
		const notInA = [...new Set([...b].filter(x => !a1.has(x)))];
		return {
			'new': notInA,
			'old': notInB
		};
	}

}

export default ArrayHelper;
