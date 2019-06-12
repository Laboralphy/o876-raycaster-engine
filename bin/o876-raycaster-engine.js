#!/usr/bin/env node

/**
 * O876 Raycaster Engine script
 *
 * @description This scripts launches the development server and accepts some options to configure port and directories
 *
 * @author Raphaël Marandet
 * @email raphael.marandet(at)gmail(dot)com
 * @date 2019-06-12
 */


const ArgumentParser = require('../tools/argument-parser');
const Service = require('../tools/service/index');;



function initArgumentParser() {
    ArgumentParser.setArgumentDefinition([
        {
            name: 'server_port',
            desc: 'Sets the listening port value (by default 8080).',
            short: 'p',
            long: 'port',
            required: false,
            value: {
                required: true,
                type: 'number'
            }
        },
        {
            name: 'vault_dir',
            desc: 'Sets the location of the map editor save files.',
            short: 's',
            long: 'vault-dir',
            required: false,
            value: {
                required: true,
                type: 'string'
            }
        },
        {
            name: 'game_dir',
            desc: 'Defines game project location. If you have a game project that uses this framework you may specify ' +
                'its location to allow the Map Editor exports completed levels there.',
            short: 'g',
            long: 'game-dir',
            required: false,
            value: {
                required: true,
                type: 'string'
            }
        },
        {
            name: 'help',
            desc: 'Displays this help.',
            short: 'h',
            long: 'help',
            required: false
        }
    ]);
}

/**
 * The main function
 */
function main() {
    initArgumentParser();
    const r = ArgumentParser.parse(process.argv.slice(2));
    if (r.help) {
        console.log(ArgumentParser.getHelpString());
        return;
    }
    const options = {};
    if ('server_port' in r) {
        options.port = r.server_port;
    }
    if ('vault_dir' in r) {
        options.vault_path = r.vault_dir;
    }
    if ('game_dir' in r) {
        options.game_path = r.game_dir;
    }
    Service.run(options);
}

main();