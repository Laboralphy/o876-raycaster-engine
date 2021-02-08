import {createNamespacedHelpers} from 'vuex';
import * as MUTATIONS from '../store/modules/album/mutation-types';

const {mapGetters, mapMutations} = createNamespacedHelpers('album');

export default {
    computed: {
        ...mapGetters([
            'getPhotos',
            'getPhotoTypes',
            'getActiveType'
        ])
    },

    methods: {
        ...mapMutations({
            setActiveType: MUTATIONS.SET_ACTIVE_TYPE
        })
    }
}