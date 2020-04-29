<template>
    <ul class="tab-list">
        <li :class="getAlbumActiveType === 'debug' ? 'selected' : ''" @click="selected('debug')">{{ STRINGS.PHOTO_TYPES_DEBUG }}</li>
        <li :class="getAlbumActiveType === 'clues' ? 'selected' : ''" @click="selected('clues')">{{ STRINGS.PHOTO_TYPES_CLUE }}</li>
        <li :class="getAlbumActiveType === 'wraiths' ? 'selected' : ''" @click="selected('wraiths')">{{ STRINGS.PHOTO_TYPES_WRAITHS }}</li>
        <li :class="getAlbumActiveType === 'art' ? 'selected' : ''" @click="selected('art')">{{ STRINGS.PHOTO_TYPES_ART }}</li>
        <li :class="getAlbumActiveType === 'archives' ? 'selected' : ''" @click="selected('archives')">{{ STRINGS.PHOTO_TYPES_ARCHIVES }}</li>
    </ul>
</template>

<script>
    import STRINGS from './mixins/strings';
    import * as MUTATIONS from '../store/modules/ui/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    const {mapGetters: uiMapGetters, mapMutations: uiMapMutations} = createNamespacedHelpers('ui');

    export default {
        name: "PhotoTypes",

        mixins: [STRINGS],

        props: {
            active: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        computed: {
            ...uiMapGetters([
                'getPhotoTypes',
                'getAlbumActiveType'
            ])
        },

        methods: {
            ...uiMapMutations({
                setActiveType: MUTATIONS.SET_ALBUM_ACTIVE_TYPE
            }),
            selected: function(type) {
                this.setActiveType({value: type});
            }
        }
    }
</script>

<style scoped>
    ul.tab-list {
        margin: 0;
    }
    ul.tab-list > li {
        display: inline-block;
        background-color: #8b4513;
        border: solid thin #251205;
        border-radius: 0.25em;
        color: #b58868;
        font-family: "KingthingsTrypewriter2", Courier, monospace;
        font-size: 0.8em;
        padding: 0.125em 0.35em;
    }
    ul.tab-list > li:hover {
        display: inline-block;
        background-color: #d76b1d;
        color: #caaa93;
        border: solid thin #381e0d;
        cursor: pointer;
    }

    ul.tab-list > li.selected,
    ul.tab-list > li.selected:hover
    {
        display: inline-block;
        background-color: #e0ab84;
        color: #f8f8f7;
        border: solid thin #5a3b26;
        cursor: default;
    }
</style>