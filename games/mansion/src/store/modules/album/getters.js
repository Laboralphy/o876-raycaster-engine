export default {
    getPhotos: state => state.photos.filter(p => p.type === state.activeType),
    getActiveType: state => state.activeType,
    getPhotoTypes: state => state.photoTypes
};