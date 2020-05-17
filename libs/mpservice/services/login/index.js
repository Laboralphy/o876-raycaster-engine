const ServiceAbstract = require('../../service-manager/ServiceAbstract');
const logger = require('../../logger');
const STRINGS = require('../../consts/strings');
const STATUS = require('../../consts/status');

class ServiceLogin extends ServiceAbstract {
    constructor() {
        super();
    }

    connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;

        /**
         * ### REQ_LOGIN
         * Un client souhaite s'identifier après s'etre connecté.
         * Il doit transmettre son nom et son mot de passe.
         * Le serveur retransmet immédiatement un identifiant client si l'identification réussit
         * si l'identification échoue, le serveur renvoie {id: null}
         * @param name {string} nom du client
         * @param pass {string} mot de passe du client
         * @param ack {Function}
         */
        socket.on('REQ_LOGIN', ({name, pass}, ack) => {
            // si le client est déja identifié...
            if (client.status !== STATUS.UNIDENTIFIED) {
                throw new Error('Invalid login request : client "' + client.id + '" (name "' + client.name + '") is already identified !');
            }
            if (name.length > 2) {
                client.name = name;
                client.id = socket.client.id;
                logger.logfmt(STRINGS.login.granted, client.id, client.name);
                this._broadcast('client-login', {client});
                ack({id: client.id});
            } else {
                logger.logfmt(STRINGS.login.denied, client.id, client.name);
                client.id = null;
                ack({id: null});
            }
        });
    }
}

module.exports = ServiceLogin;