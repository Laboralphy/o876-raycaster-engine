import scandir from 'libs/scandir';
const r = require.context('./thinkers.d', true, /\.js$/);
const m = scandir(r);
export default m;
