export default {
    getPhotos: state => state.photos.filter(p => p.type === state.activeType),
    getPhotoTypes: state => {
        const aTypes = new Set(state.photos.map(p => p.type));
        return ([...aTypes]).sort();
    },
    getActiveType: state => state.activeType
};