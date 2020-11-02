const promfs = require('../prom-fs');
const path = require('path');
const crypto = require('crypto');

class UserManager {

    constructor() {
        this._vaultPath = '';
    }

    /**
     *
     * @param value {string}
     */
    set vaultPath (value) {
        this._vaultPath = value;
    }

    get vaultPath () {
        return this._vaultPath;
    }

    /**
     * Get an hashed string of some input
     * @param s {string}
     * @return {string}
     */
    hash(s) {
        return crypto
            .createHash('sha256')
            .update(s)
            .digest('hex');
    }

    /**
     * Returns the user's home folder
     * @return {string}
     */
    getUserHome(id) {
        return path.join(this._vaultPath, id)
    }

    /**
     * checks if user name is valid
     * @param username {string}
     * @return {boolean|boolean}
     */
    checkUserName(username) {
        return username.length >= 3 && username.length <= 64;
    }

    /**
     * checks if user already exists
     * @param id
     * @return {Promise<boolean>}
     */
    async isUserExists(id) {
        try {
            const x = await promfs.stat(this.getUserHome(id));
            return !!x;
        } catch (e) {
            return false;
        }
    }

    /**
     * Creates a new user, throws error if already exist
     * @param username {string}
     * @param password {string}
     */
    async createUser(username, password) {
        const id = this.hash(username);
        if (await this.isUserExists(id)) {
            // utilisateur déja existant
            throw new Error('user already exist');
        } else if (this.checkUserName(username)) {
            // utilisateur inexistant : créer
            const sHome = this.getUserHome(id);
            await promfs.mkdir(sHome);
            await promfs.mkdir(path.join(sHome, 'maps'));
            const dNow = new Date();
            const oUser = {
                id,
                name: username,
                password: this.hash(password),
                email: '',
                "date-creation": dNow.getTime(),
                "date-last-visit": dNow.getTime()
            };
            await promfs.write(path.join(sHome, 'user.json'), JSON.stringify(oUser));
            return oUser;
        } else {
            // nom d'utilisateur invalide
            throw new Error('user name is invalid (length must be inside range 3..64 characters)');
        }
    }

    async loadUser(id) {
        if (await this.isUserExists(id)) {
            const sHome = this.getUserHome(id);
            return JSON.parse(await promfs.read(path.join(sHome, 'user.json')));
        } else {
            throw new Error('user does not exist');
        }
    }

    async storeUser(id, oUser) {
        if (await this.isUserExists(id)) {
            const sHome = this.getUserHome(id);
            await promfs.write(path.join(sHome, 'user.json'), JSON.stringify(oUser));
        } else {
            throw new Error('user does not exist');
        }
    }

    async getUserData(id) {
        const oUser = await this.loadUser(id);
        const dNow = new Date();
        oUser['date-last-visit'] = dNow.getTime();
        await this.storeUser(id, oUser);
        return oUser;
    }

    /**
     * Finds a user with username and password
     * @param username {string}
     * @param password {string}
     * @return {Promise<*>}
     */
    async findUser(username, password) {
        const id = this.hash(username);
        if (await this.isUserExists(id)) {
            const oUser = await this.getUserData(id);
            const hashPass = this.hash(password);
            // given password is hashed and compared to hashed version of user password
            if (hashPass === oUser.password) {
                return oUser;
            }
        }
        return null;
    }
}

module.exports = UserManager;