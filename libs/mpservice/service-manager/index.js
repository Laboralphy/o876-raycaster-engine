const ClientManager = require('../client-manager');
const logger = require('../logger');

const util = require('util');
const STRINGS = require('../consts/strings');

class ServiceManager {
    constructor() {
        this.clientManager = new ClientManager();
        this._plugins = [];
    }

    /**
     * Ajoute un plgin à la liste des plugin de service
     * @param instance {string|object}
     * @returns {*}
     */
    plugin(instance) {
        if (typeof instance === 'string') {
            let pClass = require('./' + instance);
            let oInstance = new pClass();
            return this.plugin(oInstance);
        }
        instance.clientManager = this.clientManager;
        instance.events.on('plugin-message',
            (_event, data) => {
                this._plugins.forEach(p => {
                    p.events.emit(_event, data);
                });
            }
        );
        logger.logfmt(STRINGS.service.plugin_loaded, instance.constructor.name);
        this._plugins.push(instance);
        return this;
    }

    /**
     * Suppression du client de toutes les instances et les services
     * @param client {*}
     */
    destroyClient(client) {
        let id = client.id;
        this._plugins.forEach(p => p.disconnectClient(client));
        this.clientManager.unregisterClient(id);
        client.id = null;
    }

    /**
     * Invoquée à chaque connection d'un client
     * @param socket
     */
    run(socket) {
        logger.logfmt(STRINGS.service.connected, socket.client.id);
        let client = this.clientManager.register(socket.client.id);
        client.socket = socket;

        /**
         * Evènement : lorsqu'un client se déconnecte
         */
        socket.on('disconnect', () => {
            let id = socket.client.id;
            logger.logfmt(STRINGS.service.disconnected, id);
            this.destroyClient(client);
        });

        this._plugins.forEach(p => p.connectClient(client));
    }
}

module.exports = ServiceManager;