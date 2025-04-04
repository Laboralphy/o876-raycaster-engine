const awilix = require('awilix')
const aliases = require('./aliases.json')

function createContainer() {
    const container = awilix.createContainer()

    container.loadModules(
        [
            'srv/application/use-cases/**/*.js',
            'srv/controllers/*.js',
            'srv/frameworks/persistance/File/*.js',
            'srv/frameworks/persistance/InMemory/*.js',
            'srv/frameworks/external-services/*.js'
        ],
        {
            resolverOptions: {
                register: awilix.asClass,
                lifetime: awilix.Lifetime.SINGLETON
            }
        }
    )
    // Définir les alias utilisés dans l'application
    // Les alias sont des pointeurs vers différentes implémentations
    const oAliases = {}
    for (const key in aliases) {
        oAliases[key] = awilix.aliasTo(aliases[key])
    }
    container.register({
        ...oAliases,
        RCGDK_MAP_EDITOR: awilix.asValue(parseInt(process.env.RCGDK_MAP_EDITOR) !== 0)
    })
    return container
}

module.exports = {
    createContainer
}
