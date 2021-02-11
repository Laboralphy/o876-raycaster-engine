export default {
    getPhotos: state => state.photos.filter(p => p.type === state.activeType),
    getActiveType: state => state.activeType,
    getPhotoTypes: state => state.photoTypes,
    getAllPhotos: state => state.photos,
    getStateContent: state => state,
    getAlbumTotalScore: state => state.photos.reduce((prev, curr) => prev + curr.value,1)
};
