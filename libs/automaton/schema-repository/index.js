const jsonschema = require('jsonschema')

const SCHEMAS = {
    '/transition': require('./transition.schema.json'),
    '/state': require('./state.schema.json'),
    '/test': require('./test.schema.json')
}

const jsv = new jsonschema.Validator()
for (const [sId, sch] of Object.entries(SCHEMAS)) {
    jsv.addSchema(sch, sId)
}

module.exports = {
    validate: function (oInput, sId) {
        const result = jsv.validate(oInput, SCHEMAS[sId])
        if (!result.valid) {
            result.errors.forEach((...s) => console.error(...s))
            throw new EvalError('input data does not valid according to schema')
        }
    }
}
