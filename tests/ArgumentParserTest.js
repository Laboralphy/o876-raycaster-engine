const AP = require('../tools/argument-parser');

describe('#getArgumentShortValueString', function() {
    it('should return an empty string', function () {
        const r = AP.getArgumentShortValueString({short: 'p', desc: 'the most simple switch', required: false});
        expect(r).toBe('');
    });
    it('should return string with optional value of short switch', function () {
        const r = AP.getArgumentShortValueString({
            name: 'variable',
            short: 'p',
            desc: 'the most simple switch',
            required: false,
            value: {required: false, type: 'string'}
        });
        expect(r).toBe(' [string]');
    });
    it('should return string with requried value of short switch', function () {
        const r = AP.getArgumentShortValueString({
            name: 'variable',
            short: 'p',
            desc: 'the most simple switch',
            required: false,
            value: {required: true, type: 'string'}
        });
        expect(r).toBe(' <string>');
    });
});


describe('#getArgumentLongValueString', function() {

    it('should return string with optionnal value of long switch', function() {
        const r = AP.getArgumentLongValueString({ name: 'variable', long: 'port', desc:'the most simple switch', required: false, value: {required: false, type: 'string'}});
        expect(r).toBe('[=string]');
    });
    it('should return string with required value of long switch', function() {
        const r = AP.getArgumentLongValueString({ name: 'variable', long: 'port', desc:'the most simple switch', required: false, value: {required: true, type: 'string'}});
        expect(r).toBe('=<string>');
    });
});


describe('#getArgumentString', function() {

    it('string for an optionnal simple short argument', function() {
        const r = AP.getArgumentString({
            name: 'variable',
            short: 'p',
            desc: 'sets p variable',
            required: false
        });
        expect(r).toBe('\t-p\n\t\tsets p variable');
    });

    it('string for an optionnal simple long argument', function() {
        const r = AP.getArgumentString({
            name: 'variable',
            long: 'pppp',
            desc: 'sets p variable',
            required: false
        });
        expect(r).toBe('\t--pppp\n\t\tsets p variable');
    });

    it('string for a simple short argument with required value', function() {
        const r = AP.getArgumentString({
            short: 'p',
            desc: 'sets p variable',
            required: false,
            value: {
                required: true,
                type: 'number'
            }
        });
        expect(r).toBe('\t-p <number>\n\t\tsets p variable');
    });

    it('string for a simple short argument with optionnal value', function() {
        const r = AP.getArgumentString({
            name: 'variable',
            short: 'p',
            desc: 'sets p variable',
            required: false,
            value: {
                required: false,
                type: 'number'
            }
        });
        expect(r).toBe('\t-p [number]\n\t\tsets p variable');
    });

    it('string for a simple long argument with required value', function() {
        const r = AP.getArgumentString({
            name: 'variable',
            long: 'abcdef',
            desc: 'sets abcdef variable',
            required: false,
            value: {
                required: true,
                type: 'number'
            }
        });
        expect(r).toBe('\t--abcdef=<number>\n\t\tsets abcdef variable');
    });

    it('string for a simple long argument with optionnal value', function() {
        const r = AP.getArgumentString({
            name: 'variable',
            long: 'abcdef',
            desc: 'sets abcdef variable',
            required: false,
            value: {
                required: false,
                type: 'number'
            }
        });
        expect(r).toBe('\t--abcdef[=number]\n\t\tsets abcdef variable');
    });
});

describe('#checkRequiredArguments', function() {
    it('should not trigger error message', function() {
        expect(function() {
            AP.checkRequiredArguments({
                p: {
                    value: ''
                }
            }, [
                { name: 'variable1', short: 'p', long: 'abcdef', required: true},
                { name: 'variable2', short: 'x', long: 'xyz', required: false},
            ]);
        }).not.toThrow();
    });

    it('p should be missing', function() {
        expect(function() {
            AP.checkRequiredArguments({
                x: {
                    value: ''
                }
            }, [
                { name: 'variable1', short: 'p', long: 'abcdef', required: true},
                { name: 'variable2', short: 'x', long: 'xyz', required: false},
            ]);
        }).toThrow();
    });
});

describe('#checkRequiredArgumentValues', function() {

    it('should not trigger error message', function() {
        expect(function() {
            AP.checkRequiredArgumentValues({
                p: {
                    value: 'xxx'
                }
            }, [
                { name: 'variable1', short: 'p', long: 'abcdef', required: false, value: { required: true, type: 'string'}},
                { name: 'variable2', short: 'x', long: 'xyz', required: false},
            ]);
        }).not.toThrow();
    });


    it('should trigger error message', function() {
        expect(function() {
            AP.checkRequiredArgumentValues({
                p: {
                    value: ''
                }
            }, [
                { name: 'variable1', short: 'p', long: 'abcdef', required: false, value: { required: true, type: 'string'}},
                { name: 'variable2', short: 'x', long: 'xyz', required: false},
            ]);
        }).toThrow();
    });

});

describe('#buildArgumentStructure', function() {
    const aDef = [
        {
            name: 'port_value',
            short: 'p',
            long: 'port',
            required: false,
            value: {
                required: true,
                type: 'number'
            }
        },

        {
            name: 'vault_path',
            short: 'v',
            long: 'vault-path',
            required: true,
            value: {
                required: true,
                type: 'string'
            }
        },

        {
            name: 'active',
            short: 'a',
            long: 'active',
            required: false,
            value: {
                required: true,
                type: 'boolean'
            }
        }
    ];

    it('should build right', function() {
        const r = AP.buildArgumentStructure({
            p: {
                value: '999',
            },
            'vault-path': {
                value: '/test/test/'
            },
            a: {
                value: '1'
            }
        }, aDef);
        expect(r).toEqual({
            port_value: 999,
            vault_path: '/test/test/',
            active: true
        });
    });
});


describe('#parse', function() {
       const aDef = [
        {
            name: 'port_value',
            short: 'p',
            long: 'port',
            required: false,
            value: {
                required: true,
                type: 'number'
            }
        },

        {
            name: 'vault_path',
            short: 'v',
            long: 'vault-path',
            required: true,
            value: {
                required: true,
                type: 'string'
            }
        },

        {
            name: 'active',
            short: 'a',
            long: 'active',
            required: false,
            value: {
                required: true,
                type: 'boolean'
            }
        }
    ];

    it('should build right', function() {
        AP.setArgumentDefinition(aDef);
        const r = AP.parse(('-p 888 --vault-path=/riri/fifi/loulou/ -a 0').split(' '));
        expect(r).toEqual({
            port_value: 888,
            vault_path: '/riri/fifi/loulou/',
            active: false
        });
    });
});
