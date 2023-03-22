import scandir from 'libs/scandir';
const reqBlueprints = require.context('./blueprints', true, /\.json$/);
const reqTilesets = require.context('./tilesets', true, /\.json$/);
const reqGhosts = require.context('./ghosts', true, /\.json$/)
const reqItems = require.context('./items', true, /\.json$/)

function makeArrayFromObject (oObject) {
    const aArray = []
    for (const [id, value] of Object.entries(oObject)) {
        aArray.push({
            id,
            ...value
        })
    }
    return aArray
}

const BLUEPRINTS = makeArrayFromObject(scandir(reqBlueprints))
const TILESETS = makeArrayFromObject(scandir(reqTilesets))
const GHOSTS = scandir(reqGhosts)
const ITEMS = makeArrayFromObject(scandir(reqItems))

export default {
    BLUEPRINTS,
    TILESETS,
    GHOSTS,
    ITEMS
}