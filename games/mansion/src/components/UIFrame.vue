<template>
    <section :class="getComputedClass">
        <Sidebar></Sidebar>
        <Album v-if="getUIActiveTab === 'album'"></Album>
        <DivDummy v-if="getUIActiveTab === 'inv'" title="inventory"></DivDummy>
        <DivDummy v-if="getUIActiveTab === 'notes'" title="Notes"></DivDummy>
        <PhotoDetails
                v-if="isPhotoDetailsVisible"
                :content="getPhotoDetailsContent"
                :title="getPhotoDetailsTitle"
                :score="getPhotoDetailsValue"
                :description="getPhotoDetailsDescription"
        ></PhotoDetails>
    </section>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';

    import Album from "./Album.vue";
    import Sidebar from "./Sidebar.vue";
    import DivDummy from "./DivDummy.vue";
    import PhotoDetails from "./PhotoDetails.vue";

    const {mapGetters: uiMapGetters} = createNamespacedHelpers('ui');

    export default {
        name: "UIFrame",
        components: {PhotoDetails, DivDummy, Sidebar, Album},
        computed: {
            ...uiMapGetters([
                'getUIActiveTab',
                'isUIFrameFullyVisible',
                'isPhotoDetailsVisible',
                'getPhotoDetailsTitle',
                'getPhotoDetailsContent',
                'getPhotoDetailsDescription',
                'getPhotoDetailsValue'
            ]),
            getComputedClass: function() {
                const a = ['ui-frame'];
                a.push(this.isUIFrameFullyVisible ? 'visible' : 'hidden');
                return a.join(' ');
            }
        }
    }
</script>

<style scoped>
    section.ui-frame {
        opacity: 0;
        transition: opacity 300ms ease-in;
    }

    section.ui-frame.visible {
        opacity: 1;
        transition: opacity 300ms ease-out;
    }

    section.ui-frame.hidden {
        opacity: 0;
        transition: opacity 300ms ease-in;
    }
</style>