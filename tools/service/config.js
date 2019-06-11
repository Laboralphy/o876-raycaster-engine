const path = require('path');
const os = require('os');
const CONFIG_PATH = path.resolve(os.homedir(), '.o876-raycaster-engine');

module.exports = {
    port: 8080,
    vault_path: path.resolve(CONFIG_PATH, 'vault')
};