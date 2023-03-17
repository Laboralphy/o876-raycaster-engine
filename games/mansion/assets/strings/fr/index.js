import GENERAL from './general.json'

const reqPhotos = require.context('./photos', true, /^(.*\.(js$|json$))[^.]*$/i);
const reqItems = require.context('./items', true, /^(.*\.(js$|json$))[^.]*$/i);
const reqNotes = require.context('./notes', true, /^(.*\.(js$|json$))[^.]*$/i);

const PHOTOS = {}
const ITEMS = {}
const NOTES = {}

reqPhotos.keys().forEach(function (key) {
    PHOTOS[key.match(/([^\/\\.]+)\.(js|json)$/)[1]] = reqPhotos(key);
});
reqItems.keys().forEach(function (key) {
    ITEMS[key.match(/([^\/\\.]+)\.(js|json)$/)[1]] = reqItems(key);
});
reqNotes.keys().forEach(function (key) {
    NOTES[key.match(/([^\/\\.]+)\.(js|json)$/)[1]] = reqNotes(key);
});

export default {
    ...GENERAL,
    PHOTOS,
    ITEMS,
    NOTES
}
