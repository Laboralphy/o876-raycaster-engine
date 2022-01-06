import scandir from 'libs/scandir';
const r = require.context('./scripts.d', true, /\.js$/);
const m = scandir(r);
export default m;
