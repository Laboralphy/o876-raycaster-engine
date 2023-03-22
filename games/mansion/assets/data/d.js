const fs = require('fs')
const ghosts = require('./ghosts.json')
const items = require('./items.json')
const tilesets = require('./tilesets.json')
const blueprints = require('./blueprints.json')

function writeFile (oObjWithId, sPath) {
    const { id } = oObjWithId
    delete oObjWithId.id
    fs.writeFileSync(sPath + '/' + id + '.json', JSON.stringify(oObjWithId, null, '  '))
}

items.forEach(x => writeFile(x, './items'))
blueprints.forEach(x => writeFile(x, './blueprints'))
tilesets.forEach(x => writeFile(x, './tilesets'))

for (const [id, value] of Object.entries(ghosts)) {
    value.id = id
    writeFile(value, './ghosts')
}