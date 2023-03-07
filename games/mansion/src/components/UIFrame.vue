<template>
    <section :class="getComputedClass">
        <Sidebar></Sidebar>
        <Album v-if="getUIActiveTab === 'album'"></Album>
        <Inventory v-if="getUIActiveTab === 'inv'"></Inventory>
        <Notes v-if="getUIActiveTab === 'notes'"></Notes>
        <Settings v-if="getUIActiveTab === 'settings'"></Settings>
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
    import Notes from "./Notes.vue";
    import Album from "./Album.vue";
    import Settings from "./Settings.vue";
    import Sidebar from "./Sidebar.vue";
    import DivDummy from "./DivDummy.vue";
    import PhotoDetails from "./PhotoDetails.vue";
    import Inventory from "./Inventory.vue";
    import ui from "../mixins/ui";

    export default {
        name: "UIFrame",
        components: {Settings, Notes, Inventory, PhotoDetails, DivDummy, Sidebar, Album},
        mixins: [ui],
        computed: {
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