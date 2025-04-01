const { getType } = require('../get-type');

const CMP_FUNCTIONS = {

    $eq: operand => v => v.toString().toLowerCase() === operand?.toString()?.toLowerCase(),

    $neq: operand => v => !(v.toString().toLowerCase() === operand?.toString()?.toLowerCase()),
    $lt: operand => v => v < operand,
    $gt: operand => v => v > operand,
    $lte: operand => v => v <= operand,
    $gte: operand => v => v >= operand,

    $in: operand => {
        switch (getType(operand)) {
        case 'string':
            return v => v.includes(operand);

        case 'array':
            return v => operand.some(x => {
                if (x instanceof RegExp) {
                    return !!v.match(x);
                } else {
                    return x == v;
                }
            });

        default:
            throw new Error('ERR_OPERAND_TYPE_MISMATCH: $in ' + getType(operand) + ' expected string or array');
        }
    },

    $nin: operand => {
        switch (getType(operand)) {
        case 'string':
        case 'array':
            return v => !operand.includes(v);

        default:
            throw new TypeError('ERR_OPERAND_TYPE_MISMATCH: $in ' + getType(operand) + ' expected string or array');
        }
    },

    $type: operand => v => getType(v) === operand,
    $mod: ([divisor, remainder]) => v => (v % divisor) === remainder,
    $exists: (operand, field, data) => () => operand ? field in data : !(field in data),
    $match: operand => {
        if (operand instanceof RegExp) {
            return v => !!v.match(operand);
        } else {
            throw new TypeError('ERR_OPERAND_TYPE_MISMATCH: $match ' + operand);
        }
    }
};

module.exports = {
    CMP_FUNCTIONS
};
