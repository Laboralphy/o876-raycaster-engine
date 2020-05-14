<template>
    <div class="photo-details" @click.self="close">
        <div class="container ui-menu-window">
            <TitleAndCo :title="title"><div class="score">{{ computedScore }}</div></TitleAndCo>
            <hr />
            <Photo :content="content" :caption="''" :big="true"></Photo>
            <p class="description" v-for="d in description">{{ d }}</p>
        </div>
    </div>
</template>

<script>
    import STRINGS from './mixins/strings';
    import * as ALBUM_MUTATIONS from '../store/modules/album/mutation-types';
    import * as UI_MUTATIONS from '../store/modules/ui/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    import PhotoTypes from "./PhotoTypes.vue";
    import TitleAndCo from "./TitleAndCo.vue";
    import Photo from "./Photo.vue";

    const {mapGetters: albumMapGetters, mapMutations: albumMapMutations} = createNamespacedHelpers('album');
    const {mapGetters: uiMapGetters, mapMutations: uiMapMutations} = createNamespacedHelpers('ui');



    export default {
        name: "PhotoDetails",
        components: {Photo, TitleAndCo},
        props: {
            title: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: false,
                default: 0
            },
            content: {
                type: String,
                required: true
            },
            description: {
                type: Array,
                required: true
            }
        },

        computed: {
            computedScore: function() {
                if (this.score > 0) {
                    return this.score.toString() + ' pt' + (this.score > 1 ? 's' : '');
                } else {
                    return '';
                }
            }
        },

        methods: {
            ...uiMapMutations({
                setPhotoDetails: UI_MUTATIONS.SET_PHOTO_DETAILS
            }),

            close: function() {
                this.setPhotoDetails({visible: false});
            }
        }
    }
</script>

<style scoped>
    div.photo-details {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    div.photo-details > div.container {
        width: 66%;
        height: 50%;
        top: 25%;
        left: 16%;
    }

    p.description {
        margin-left: 2em;
        padding-right: 1.2em;
        text-align: justify;
        font-size: 0.9em;
        color: black;
        font-family: "OldNewspaperTypes", Courier, monospace;
    }

    p.description::first-letter {
        font-weight: bold;
        font-size: 130%;
    }

    hr {
        opacity: 0.6;
        border: none;
        border-top: solid thin black;
    }

    .score {
        font-family: "Lucida Console", Monaco, monospace;
        color: rgba(177, 66, 47, 0.8);
        font-weight: bold;
        font-size: 0.9em;
        margin-left: 2em;
        font-style: italic;
        margin-top: 0.25em;
    }
</style>