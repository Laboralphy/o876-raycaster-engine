<template>
    <ul class="tab-list">
        <li :class="getActiveType === 'debug' ? 'selected' : ''" @click="selected('debug')">{{ STRINGS.PHOTO_TYPES_DEBUG }}</li>
        <li :class="getActiveType === 'clues' ? 'selected' : ''" @click="selected('clues')">{{ STRINGS.PHOTO_TYPES_CLUE }}</li>
        <li :class="getActiveType === 'wraiths' ? 'selected' : ''" @click="selected('wraiths')">{{
            STRINGS.PHOTO_TYPES_WRAITH }}</li>
        <li :class="getActiveType === 'art' ? 'selected' : ''" @click="selected('art')">{{ STRINGS.PHOTO_TYPES_ART }}</li>
        <li :class="getActiveType === 'ambient' ? 'selected' : ''" @click="selected('ambient')">{{ STRINGS.PHOTO_TYPES_AMBIENT }}</li>
        <li :class="getActiveType === 'archives' ? 'selected' : ''" @click="selected('archives')">{{
            STRINGS.PHOTO_TYPES_ARCHIVE }}</li>
    </ul>
</template>

<script>
    import STRINGS from './mixins/strings';
    import * as MUTATIONS from '../store/modules/album/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    const {mapGetters: albumMapGetters, mapMutations: albumMapMutations} = createNamespacedHelpers('album');

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
            ...albumMapGetters([
                'getPhotoTypes',
                'getActiveType'
            ])
        },

        methods: {
            ...albumMapMutations({
                setActiveType: MUTATIONS.SET_ACTIVE_TYPE
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