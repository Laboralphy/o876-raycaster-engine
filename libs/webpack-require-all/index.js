function main (sFolder) {
    const req = require.context(sFolder, true, /^(.*\.(js$|json$))[^.]*$/igm);
    const oFiles = {}
    req.keys().forEach(function (key) {
        oFiles[key] = req(key);
    });
    return oFiles
}

module.exports = main