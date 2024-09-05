/**
 * This is te structure returned when asking for a list of published levels
 *
 * @class
 * @property name {string} level identifier
 * @property date {number} level date of publication
 * @property preview {string} static location of level preview image
 * @property textures {string[]} list of all texture references used by level
 */
class PublishedLevelMetaData {
    constructor ({
        name,
        date,
        preview,
        textures
    }) {
        this.name = name
        this.date = date
        this.preview = preview
        this.textures = textures
    }
}

module.export = PublishedLevelMetaData