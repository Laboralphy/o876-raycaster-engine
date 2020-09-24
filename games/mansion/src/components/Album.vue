<template>
    <div class="ui-panel-window ui-size-60-90 album">
        <TitleAndCo :title="STRINGS.MAIN_TAB_ALBUM">
            <PhotoTypes></PhotoTypes>
        </TitleAndCo>
        <div class="photo-container" v-if="getPhotos.length > 0">
            <Photo
                v-for="photo in getPhotos"
                :key="photo.id"
                :content="photo.content"
                :caption="(photo.ref in STRINGS.PHOTOS) ? STRINGS.PHOTOS[photo.ref].title : '[' + photo.ref + ']'"
                :gray="getActiveType === 'archive'"
                @click="photoClicked(photo.id)"
            ></Photo>
        </div>
        <div v-else class="no-photo">
            <span>{{ STRINGS.ALBUM_TAB_EMPTY }}</span>
        </div>
    </div>
</template>

<script>
    import STRINGS from './mixins/strings';
    import * as ALBUM_MUTATIONS from '../store/modules/album/mutation-types';
    import * as UI_MUTATIONS from '../store/modules/ui/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    import Photo from "./Photo.vue";
    import PhotoTypes from "./PhotoTypes.vue";
    import TitleAndCo from "./TitleAndCo.vue";

    const {mapGetters: albumMapGetters, mapMutations: albumMapMutations} = createNamespacedHelpers('album');
    const {mapGetters: uiMapGetters, mapMutations: uiMapMutations} = createNamespacedHelpers('ui');

    export default {
        name: "Album",
        mixins: [STRINGS],
        components: {TitleAndCo, Photo, PhotoTypes},

        data: function() {
            return {
                details: false
            };
        },

        computed: {
            ...albumMapGetters([
                'getPhotos',
                'getActiveType'
            ])
        },

        methods: {
            ...albumMapMutations({
                setActiveType: ALBUM_MUTATIONS.SET_ACTIVE_TYPE
            }),

            ...uiMapMutations({
                setPhotoDetails: UI_MUTATIONS.SET_PHOTO_DETAILS
            }),

            photoClicked: function(id) {
                const {ref, value, content} = this.getPhotos.find(p => p.id === id);
                const oPhotoData = this.STRINGS.PHOTOS[ref];
                if (ref === undefined) {
                    throw new Error('this photo is unknown : id ' + id + ' - ref ' + ref);
                }
                const title = oPhotoData.title;
                const description = oPhotoData.description;
                this.setPhotoDetails({
                    title,
                    description,
                    content,
                    value,
                    visible: true
                });
            }
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

    div.no-photo {
        font-family: "KingthingsTrypewriter2", Courier, monospace;
        font-size: 3em;
        color: rgba(0, 0, 0, 0.25);
        margin-top: 10%;
        margin-left: 15%;
        font-weight: bolder;
        transform: rotate(-12deg);
    }

    div.photo-details {
        height: 33%;
    }
</style>