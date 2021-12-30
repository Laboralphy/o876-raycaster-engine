import {createNamespacedHelpers} from 'vuex';
import * as MUTATIONS from '../store/modules/album/mutation-types';

const {mapGetters, mapMutations} = createNamespacedHelpers('album');

export default {
    computed: {
        ...mapGetters([
          'getPhotos',
          'getPhotoTypes',
          'getActiveType',
          'getAlbumTotalScore'
        ])
    },

    methods: {
        ...mapMutations({
            setActiveType: MUTATIONS.SET_ACTIVE_TYPE
        })
    }
}
