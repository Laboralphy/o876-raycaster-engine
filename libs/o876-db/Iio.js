class Iio {
    getList (location) {
        throw new Error('ERR_NOT_IMPLEMENTED');
    }

    createLocation (location) {
        throw new Error('ERR_NOT_IMPLEMENTED');
    }

    read (location, name) {
        throw new Error('ERR_NOT_IMPLEMENTED');
    }

    write (location, name, data) {
        throw new Error('ERR_NOT_IMPLEMENTED');
    }

    remove (location, name) {
        throw new Error('ERR_NOT_IMPLEMENTED');
    }
}

module.exports = Iio;
