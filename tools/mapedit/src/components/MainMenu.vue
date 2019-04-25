<template>
    <StatusBar>
        <Siblings @select="({index}) => $router.push(routes[index])">
            <SiblingButton
                    title="Level editor"
            ><GridIcon title="Level editor"></GridIcon> Level</SiblingButton>
            <SiblingButton
                    title="Load tileset and import wall and flat tiles"
            ><MapIcon title="Load tileset and import wall and flat tiles"></MapIcon> Tiles</SiblingButton>
            <SiblingButton
                    title="Build physical blocks out of tiles"
            ><OfficeBuildingIcon title="Build physical blocks out of tiles"></OfficeBuildingIcon> Blocks</SiblingButton>
            <SiblingButton
                    title="Make animated textures"
            ><AnimationPlayIcon title="Make animated textures"></AnimationPlayIcon> Anim.</SiblingButton>
        </Siblings>
    </StatusBar>
</template>

<script>
    import StatusBar from "./StatusBar.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    import GridIcon from "vue-material-design-icons/Grid.vue";
    import Siblings from "./Siblings.vue";
    import SiblingButton from "./SiblingButton.vue";
    import AnimationPlayIcon from "vue-material-design-icons/AnimationPlay.vue";

    export default {
        name: "MainMenu",
        components: {
            AnimationPlayIcon,
            SiblingButton, Siblings, GridIcon, OfficeBuildingIcon, MapIcon, MyButton, StatusBar},
        data: function() {
            return {
                routes: [
                    '/',
                    '/load-tiles',
                    '/build-block',
                    '/build-anim'
                ]
            }
        }
    }
</script>

<style scoped>

</style>