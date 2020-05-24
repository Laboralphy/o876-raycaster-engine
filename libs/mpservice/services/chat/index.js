const ServiceAbstract = require('../../service-manager/ServiceAbstract');
const TinyTxat = require('../../../tiny-txat');
const logger = require('../../logger');
const STRINGS = require('../../consts/strings');

class ServiceTxat extends ServiceAbstract {


    constructor() {
        super();
        this.txat = new TinyTxat.System();
        this.txat.on('user-joins', ({to, user, channel}) => {
            to === user ? this.send_ms_you_join(to, channel) : this.send_ms_user_joins(to, user, channel)
        });
        this.txat.on('user-leaves', ({to, user, channel}) => this.send_ms_user_leaves(to, user, channel));
        this.txat.on('user-message', ({to, user, channel, message}) => this.send_ms_user_says(to, user, channel, message));
        let c;

        c = new TinyTxat.Channel();
        c.id = 1;
        c.name = 'system';
        c.type = 'system';
        this.txat.addChannel(c);

        c = new TinyTxat.Channel();
        c.id = 2;
        c.name = 'public';
        c.type = 'public';
        this.txat.addChannel(c);


        this.events.on('client-login', ({client}) => {
            // ajouter le client au canal public
            let oTxatUser = new TinyTxat.User(client);
            this.txat.addUser(oTxatUser);
            let oChannel = this.txat.getChannel(2);
            oChannel.addUser(oTxatUser);
        });
    }

    disconnectClient(client) {
        this.txat.dropUser(this.txat.getUser(client.id));
    }

    /**
     * ajout d'un client
     */
    connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;
        /**
         * ### REQ_CHAN_INFO
         * Un client souhaite obtenir des information sur un canal.
         * le client fournit l'identifiant, le serveur renvoie par une structure décrivant le canal
         * un coupe circuit intervient pour toute connexion non identifiée
         * @param id {string} identifiant du canal
         * @param ack {function}
         */
        socket.on('REQ_MS_CHAN_INFO', ({id}, ack) => {
            if (client.id) {
                let oChannel = this.txat.getChannel(id);
                let oTxatUser = this.txat.getUser(client.id);
                if (oChannel && oChannel.userPresent(oTxatUser)) {
                    ack({
                        id: oChannel.id(),
                        name: oChannel.name(),
                        type: oChannel.type(),
                        users: oChannel.users().map(u => ({
                            id: u.id,
                            name: u.name
                        }))
                    })
                } else {
                    ack(null);
                }
            } else {
                socket.close();
            }
        });

        /**
         * ### REQ_MS_FIND_CHAN
         * Un client recherche l'identifiant d'un canal dont il fournit le nom
         * un coupe circuit intervient pour toute connexion non identifiée
         * @param search {string} nom du canal recherché
         * @param ack {function}
         */
        socket.on('REQ_MS_FIND_CHAN', ({search}, ack) => {
            if (client.id) {
                let oChannel = this.txat.searchChannel(id);
                if (oChannel) {
                    ack({
                        id: oChannel.id(),
                        name: oChannel.name(),
                        type: oChannel.type()
                    });
                } else {
                    ack(null);
                }
            } else {
                socket.close();
            }
        });


        /**
         * ### REQ_USER_INFO
         * Un client souhaite obtenir des informations sur un utilisateur.
         * le client fournit l'identifiant, le serveur renvoie par une structure décrivant l'utilisateur
         * si l'identifiant ne correspind à rien, kick
         * @param id {string} identifiant du user
         * @param ack
         */
        socket.on('REQ_MS_USER_INFO', ({id}, ack) => {
            if (client.id) {
                let oTxatUser = this.txat.getUser(id);
                if (oTxatUser) {
                    ack({
                        id: oTxatUser.id(),
                        name: oTxatUser.name()
                    })
                } else {
                    ack(null);
                }
            } else {
                socket.close();
            }
        });


        /**
         * ### REQ_MS_JOIN_CHAN
         * Un client veut rejoindre un cannal, le client ne spécifie que le nom symbolique du canal
         * un coupe circuit intervient pour toute connexion non identifiée
         * @param id {string} id du canal recherché
         * @param ack {function}
         */
        socket.on('REQ_MS_JOIN_CHAN', ({name}, ack) => {
            if (client.id) {
                let oChannel = this.txat.searchChannel(name);
                if (!oChannel) {
                    oChannel = new TinyTxat.Channel();
                    oChannel.name(name);
                    this.txat.addChannel(oChannel);
                }
                let oTxatUser = this.txat.getUser(client.id);
                oChannel.addUser(oTxatUser);
                logger.logfmt(STRINGS.txat.join_channel, oTxatUser.name(), oChannel.name());
                ack({
                    id: oChannel.id,
                    name: oChannel.name
                });
            } else {
                socket.close();
            }
        });


        /**
         * ### MS_SAY
         * un utilisateur envoie un message de discussion
         * @param channel {string} identifiant du canal
         * @param message {string} contenu du message
         */
        socket.on('MS_SAY', ({channel, message}) => {
            if (client.id) {
                let oUser = this.txat.getUser(client.id);
                let oChannel = this.txat.getChannel(channel);
                if (!oChannel) {
                    logger.errfmt(STRINGS.txat.invalid_channel, channel);
                } else if (oChannel.userPresent(oUser)) {
                    logger.logfmt(STRINGS.txat.user_said,
                        channel,
                        client.name,
                        client.id,
                        message
                    );
                    oChannel.transmitMessage(oUser, message);
                } else {
                    logger.errfmt(STRINGS.txat.sent_to_wrong_chan, client.id, channel);
                }
            } else {
                socket.close();
            }
        });
    }

    /**
     * Avertir un client qu'il rejoin sur un canal
     * @param client {string} identifiant du client à prévenir
     * @param channel {string} information du canal concerné {id, name, type}
     */
    send_ms_you_join(client, channel) {
        let oChannel = this.txat.getChannel(channel);
        this._emit(client, 'MS_YOU_JOIN', {
            id: oChannel.id(),
            name: oChannel.name(),
            type: oChannel.type()
        });
    }

    /**
     * avertir un client de l'arrivée d'un utilisateur sur un canal
     * @param client {string} identifiant du client à prévenir
     * @param user {string} identifiant du client arrivant
     * @param channel {string} identifiant du canal concerné
     */
    send_ms_user_joins(client, user, channel) {
        let oChannel = this.txat.getChannel(channel);
        let oClient = this.txat.getUser(client);
        if (oChannel.userPresent(oClient)) {
            // le client appartient au canal
            this._emit(client, 'MS_USER_JOINS', {user, channel});
        }
    }

    /**
     * Avertir un client du départ d'un autre client d'un canal
     * @param client {string} identifiant du client à prévenir
     * @param user {string} identifiant du client partant
     * @param channel {string} identifiant du canal concerné
     */
    send_ms_user_leaves(client, user, channel) {
        this._emit(client, 'MS_USER_LEAVES', {user, channel});
    }

    /**
     * Transmettre le message d'un client à un autre
     * @param client {string} identifiant du client destinataire
     * @param user {string} identifiant du client expéditeur
     * @param channel {string} identifiant du canal concerné / null si c'est un message privé
     * @param message {string} contenu du message
     */
    send_ms_user_says(client, user, channel, message) {
        this._emit(client, 'MS_USER_SAYS', {user, channel, message});
    }
}

module.exports = ServiceTxat;