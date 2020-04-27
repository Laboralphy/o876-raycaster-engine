const r = require.context('./scripts.d', true, /\.js$/);
const m = {};
r.keys().forEach(file => {
    const key = file.match(/^\.\/(.+)\.js$/).pop();
    let oLastBranch = null;
    let oBranch = m;
    let sLastKey = '';
    key.split('/').forEach(b => {
        oLastBranch = oBranch;
        if (!(b in oBranch)) {
            oLastBranch[b] = {};
        }
        sLastKey = b;
        oBranch = oLastBranch[b];
    })
    oLastBranch[sLastKey] = r(file);
});
export default m;