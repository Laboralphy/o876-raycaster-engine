<template>
    <div class="ui-menu-window album">
        <TitleAndCo :title="STRINGS.MAIN_TAB_ALBUM">
            <PhotoTypes></PhotoTypes>
        </TitleAndCo>
        <div class="photo-container" v-if="getAlbumPhotos.length > 0">
            <Photo
                    v-for="photo in getAlbumPhotos"
                    :key="photo.id"
                    :content="photo.image"
                    :caption="photo.value.toString() + ' Pt' + (photo.value > 1 ? 's' : '')"
            ></Photo>
        </div>
        <div v-else>

        </div>
    </div>
</template>

<script>
    import STRINGS from './mixins/strings';
    import * as MUTATIONS from '../store/modules/ui/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    import Photo from "./Photo.vue";
    import PhotoTypes from "./PhotoTypes.vue";
    import TitleAndCo from "./TitleAndCo.vue";


    const {mapGetters: uiMapGetters, mapMutations: uiMapMutations} = createNamespacedHelpers('ui');


    export default {
        name: "Album",
        mixins: [STRINGS],
        components: {TitleAndCo, Photo, PhotoTypes},

        computed: {
            ...uiMapGetters([
                'getAlbumPhotos',
            ])
        },

        methods: {
            ...uiMapMutations({
                setActiveType: MUTATIONS.SET_ALBUM_ACTIVE_TYPE
            })
        }
    }
</script>

<style scoped>
    div.photo-container {
        overflow: auto;
        padding: 1%;
        margin: 0;
        width: 98%;
        height: 90%;
    }
</style>