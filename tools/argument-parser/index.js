/**
 * Argument Parser
 *
 * @description This tool parses any array of strings and tries to extract variables and values out of it.
 * It relies on a json definition given before parsing.
 * It gives a simple structure that associates variables and values.
 *
 * @author Raphaël Marandet
 * @email raphael.marandet(at)gmail(dot)com
 * @date 2019-06-12
 */

let ARGUMENTS = [];


/**
 * Get the previously set argument definition (see setArgumentDefinition)
 * @return {Array}
 */
function getArgumentDefinition() {
    return ARGUMENTS;
}


/**
 * Set argument definition (see setArgumentDefinition)
 * @param a {Array} argument definition
 * {
 *     name: string,
 *     long: string,
 *     short: string
 *     required: boolean,
 *     desc: string,
 *     value: {
 *         required: boolean,
 *         type: string
 *         default: *
 *     }
 * }
 */
function setArgumentDefinition(a) {
    ARGUMENTS = a;
}


function getArgumentLongValueString(oArg) {
    if ('value' in oArg) {
        const sType = oArg.value.type || 'any';
        if (oArg.value.required) {
            return '=<' + sType + '>';
        } else {
            return '[=' + sType + ']';
        }
    } else {
        return '';
    }
}

function getArgumentShortValueString(oArg) {
    if ('value' in oArg) {
        const sType = oArg.value.type || 'any';
        if (oArg.value.required) {
            return ' <' + sType + '>';
        } else {
            return ' [' + sType + ']';
        }
    } else {
        return '';
    }
}


/**
 * Returns a string describing the syntax of the specified argument definition
 * @param oArg {*}
 * @return {string}
 */
function getArgumentSyntax(oArg) {
    const aVars = [];
    if ('short' in oArg && oArg.short.length > 0) {
        aVars.push('-' + oArg.short + getArgumentShortValueString(oArg));
    }
    if ('long' in oArg && oArg.long.length > 0) {
        aVars.push('--' + oArg.long + getArgumentLongValueString(oArg));
    }
    return aVars.join(', ');
}

/**
 * Returns a string of the specified argument definition
 * @param oArg {*}
 * @return {string}
 */
function getArgumentString(oArg) {
    return "\t" + getArgumentSyntax(oArg) + "\n\t\t" + oArg.desc;
}





/**
 * Checks if all required arguments are present
 * @param oArgs {*} registry of specified arguments and values
 * @param aArgDef [] argument definition
 */
function checkRequiredArguments(oArgs, aArgDef) {
    const r = aArgDef
        .filter(a => a.required && !(a.short in oArgs) && !(a.long in oArgs));
    if (r.length > 0) {
        throw new Error('some missing arguments : ' + r.map(a => getArgumentSyntax(a).join(' ; ')));
    }
}

function searchArgumentDefinition(sArg, aArgDef) {
    return aArgDef.find(a =>
        a.long === sArg || a.short === sArg
    );
}

function checkRequiredArgumentValues(oArgs, aArgDef) {
    for (let sArg in oArgs) {
        if (oArgs[sArg].value.length === 0) {
            const oSearched = searchArgumentDefinition(sArg, aArgDef);
            if (oSearched && oSearched.value && oSearched.value.required) {
                throw new Error('value required for argument "' + sArg + '" : ' + getArgumentSyntax(oSearched));
            }
        }
    }
}

function buildArgumentStructure(oArgs, aArgDef) {
    checkRequiredArguments(oArgs, aArgDef);
    checkRequiredArgumentValues(oArgs, aArgDef);
    const oOutput = {};
    for (let sArg in oArgs) {
        if (sArg === '') {
            continue;
        }
        const value = oArgs[sArg].value;
        const oSearched = searchArgumentDefinition(sArg, aArgDef);
        if (oSearched) {
            const name = oSearched.name;
            if (oSearched.value) {
                switch (oSearched.value.type) {
                    case 'number':
                        oOutput[name] = parseFloat(value);
                        break;

                    case 'boolean':
                        oOutput[name] = !!parseInt(value);
                        break;

                    default:
                        oOutput[name] = value;
                        break;
                }
            } else {
                oOutput[name] = true;
            }
        } else {
            throw new Error('command line parse error : unknown option : "' + sArg + '"');
        }
    }
    return oOutput;
}

/**
 * Returns the command line parameters
 * @params aArgs {string[]} command line parameters
 * @return {*}
 */
function parseCommandLineArguments(aArgs) {
    const REG = /^([-_.a-zA-Z0-9]+)=(.*)/;
    let oSwitches = {};
    let aAlone = [];
    let sLastSwitch = '';
    for (let i = 0; i < aArgs.length; ++i) {
        const sWord = aArgs[i];
        if (sWord.startsWith('--')) {
            const w = sWord.substr(2);
            const r = w.match(REG);
            sLastSwitch = '';
            if (r) {
                oSwitches[r[1]] = {
                    value: r[2]
                };
            } else {
                oSwitches[w] = {
                    value: ''
                };
            }
        } else if (sWord.startsWith('-')) {
            sWord
                .substr(1)
                .split('')
                .forEach(w => {
                    sLastSwitch = w;
                    oSwitches[sLastSwitch] = {
                        value: ''
                    };
                })
        } else {
            if (sLastSwitch.length) {
                oSwitches[sLastSwitch].value = sWord;
                sLastSwitch = '';
            } else {
                aAlone.push(sWord);
            }
        }
    }
    return {
        switches: oSwitches,
        words: aAlone
    };
}

function parse(aArgs) {
    const r = parseCommandLineArguments(aArgs);
    return buildArgumentStructure(r.switches, getArgumentDefinition());
}

function getHelpString() {
    return getArgumentDefinition().map(d => getArgumentString(d)).join('\n\n');
}

module.exports = {
    getCommandLineArguments: parseCommandLineArguments,
    checkRequiredArguments,
    checkRequiredArgumentValues,
    getArgumentString,
    setArgumentDefinition,
    getArgumentShortValueString,
    getArgumentLongValueString,
    buildArgumentStructure,
    parse,
    getHelpString
};