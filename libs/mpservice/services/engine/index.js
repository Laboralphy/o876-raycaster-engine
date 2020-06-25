const ServiceAbstract = require('../../service-manager/ServiceAbstract');
const logger = require('../../logger');
const RC = require('../../consts/raycaster');
const STRINGS = require('../../consts/strings');
const STATUS = require('../../consts/status');


class ServiceEngine extends ServiceAbstract {
    constructor(gameInstance) {
        super();
        this._time = 0;
        this._gs = gameInstance;
        setInterval(() => this.doomloop(), RC.time_factor);

        gameInstance.events.on('mobile.created', ({players, mobile}) => this.transmitMobileCreationEvent(players, mobile));
        gameInstance.events.on('mobile.destroyed', ({players, mobile}) => this.transmitMobileDestructionEvent(players, mobile));
        gameInstance.events.on('door.open', ({players, x, y}) => {
            this._emit(players, 'G_DOOR_OPEN', {x, y})
        });
        gameInstance.events.on('door.close', ({players, x, y}) => this._emit(players, 'G_DOOR_CLOSE', {x, y}));
    }

    /**
     * Un mobile vien d'etre créé dans le moteur :
     * Il faut Transmettre aux clients un ordre de creation de mobile
     * Cet ordre contient les champs tels qu'ils sont généré par la fonction ServiceEngine::buildMobileCreationPacket
     * @param players {array|Player} liste des clients auquels envoyé l'ordre
     * @param mobile {mobile} mobile a partir duquel on créé l'ordre
     */
    transmitMobileCreationEvent(players, mobile) {
        this._emit(players, 'G_CREATE_MOBILE', {
            mobile: ServiceEngine.buildMobileCreationPacket(mobile)
        });
    }

    transmitMobileDestructionEvent(players, mobile) {
        this._emit(players, 'G_DESTROY_MOBILE', {
            mobile: ServiceEngine.buildMobileCreationPacket(mobile)
        });
    }


    doomloop() {
        this._gs.processDoors();
        let aMutations = this._gs.getStateMutations();
        // mobiles ayant besoin d'etre mis à jours chez les clients
        aMutations.mu.forEach(
            m => this._emit(
                m.p.map(p => p.id),
                'G_UPDATE_MOBILE',
                {mobile: m.m}
            )
        );
        let gs = this._gs;
        gs.removeDeadMobiles();
        gs.events.emit('tick', {time: this._time++});
    }

    error(client, e) {
        let msg = e.toString();
        console.error(e.stack);
        logger.err(msg);
        this._emit(client.id, 'G_ERROR', {
            err: msg
        });
    }

    disconnectClient(client) {
        super.disconnectClient(client);
        // supprimer l'entité du client
        this._gs.clientHasLeft(client);
    }


    /**
     * Fabrique un packet de creation de mobile
     * @param m
     * @return {{id, x, y, a: number, sx: number, sy: number, bp: module.Level.blueprint|string, a: number}}
     */
    static buildMobileCreationPacket(m) {
        let mloc = m.location;
        let mpos = mloc.position;
        let mspd = m.inertia; // vecteur de vitesse actuelle
        return {
            id: m.id,
            x: mpos.x,
            y: mpos.y,
            a: mloc.heading(),
            sx: mspd.x,
            sy: mspd.y,
            bp: m.blueprint
        };
    }

    /**
     * Fabrique un packet de mise à jour de mobile
     * @param m {Mobile}
     * @return {{id, x, y, a: number, sx: number, sy: number, f}}
     */
    static buildMobileUpdatePacket(m) {
        let mloc = m.location;
        let mpos = mloc.position;
        let mspd = m.inertia; // vecteur de vitesse actuelle
        let f = m.getNewForces();
        m.resetForces();
        return {
            id: m.id,
            x: mpos.x,
            y: mpos.y,
            a: mloc.heading(),
            sx: mspd.x,
            sy: mspd.y,
            f
        };
    }

    /**
     * appelée automatiquement lorsqu'un client se connecte au service
     * @param client
     */
    connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;

        /**
         * Le client indique qu' "il est prêt"
         * voir le détail de chaque phase
         */
        socket.on('G_READY', async ({phase}) => {
            // chargement d'un niveau
            try {
                let data;
                switch (phase) {
                    case STATUS.GAME_INITIALIZED: // le client est pret à recevoir les données d'un niveau
                        data = await this._gs.clientWantsToLoadLevel(client);
                        this._emit(client.id, 'G_LOAD_LEVEL', {
                            level: data.area.data(),
                            live: data.live
                        });
                        break;

                    case STATUS.ENTERING_LEVEL: // Le client a chargé le niveau, il est prèt à recevoir les entités
                        data = this._gs.clientHasLoadedLevel(client);
                        // transmettre au client la liste de tous les mobiles
                        this._emit(client.id, 'G_CREATE_MOBILE', {
                            mobile: data.mobiles.map(m => ServiceEngine.buildMobileCreationPacket(m))
                        });
                        this._emit(client.id, 'G_CONTROL_MOBILE', {
                            id: client.id,
                            speed: data.subject.data.speed
                        });
                        break;
                }
            } catch (e) {
                this.error(client, e);
            }
        });


        socket.on('REQ_G_UPDATE_PLAYER', (packet, ack) => {
            // appliquer la modification du mobile
            try {
                let id = client.id;
                // les packet doivent être joués.
                let aCorrPacket = this._gs.playClientMovement(id, packet);
                // on renvoie un packet contenant les dernière données validées/corrigées
                ack(aCorrPacket);
            } catch (e) {
                this.error(client, e);
            }
        });

        socket.on('REQ_G_LOAD_RSC', async ({type, ref}, ack) => {
            try {
                logger.logfmt(STRINGS.game.player_downloading_resource, client.id, type, ref);
                ack(await this._gs.resourceLoader.loadResource(type, ref));
            } catch (e) {
                this.error(client, e);
            }
        });
    }
}

module.exports = ServiceEngine;
