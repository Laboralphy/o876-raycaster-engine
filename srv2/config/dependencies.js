const awilix = require('awilix')
const aliases = require('./aliases.json')

function createContainer() {
    const container = awilix.createContainer()

    container.loadModules(
        [
            'srv2/application/use-cases/**/*.js',
            'srv2/controllers/*.js',
            'srv2/frameworks/persistance/File/*.js',
            'srv2/frameworks/persistance/InMemory/*.js',
            'srv2/frameworks/persistance/Database/*.js',
            'srv2/frameworks/external-services/*.js'
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
        ...oAliases
    })
    return container
}

module.exports = {
    createContainer
}
