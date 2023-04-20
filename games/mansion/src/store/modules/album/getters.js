export default {
    getPhotos: state => state.photos.filter(p => p.type === state.activeType),
    getPhotoCount: (state, getters) => getters.getPhotos.length,
    getActiveType: state => state.activeType,
    getFirstWorthyActiveType: (state, getters) => {
        if (getters.getPhotoCount === 0) {
            const sWorthy = state.photoTypes.find(pt => !!state.photos.find(p => p.type === pt));
            return sWorthy === undefined ? '' : sWorthy
        } else {
            return getters.getActiveType
        }

    },
    getPhotoTypes: state => state.photoTypes,
    getAllPhotos: state => state.photos,
    getStateContent: state => state,
    getAlbumTotalScore: state => state.photos.reduce((prev, curr) => prev + curr.value, 0)
};
