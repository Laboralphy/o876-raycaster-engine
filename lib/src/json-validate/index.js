import {Validator} from 'jsonschema';
const validator = new Validator();

export function jsonValidate(data, schema) {
    let result = validator.validate(data, schema);
    if (result.errors.length) {
        throw new Error(result.errors[0]);
    }
    return true;
}
