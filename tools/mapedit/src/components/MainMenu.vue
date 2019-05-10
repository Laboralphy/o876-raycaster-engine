<template>
    <StatusBar>
        <SimpleMenu :routes="routes.main"></SimpleMenu>
        <SimpleMenu style="float: right" :routes="routes.tools"></SimpleMenu>
    </StatusBar>
</template>

<script>
    import StatusBar from "./StatusBar.vue";
    import MyButton from "./MyButton.vue";
    import GridIcon from "vue-material-design-icons/Grid.vue";
    import FolderMultipleImageIcon from "vue-material-design-icons/FolderMultipleImage.vue";
    import AnimationIcon from "vue-material-design-icons/Animation.vue";
    import ToolMenu from "./ToolMenu.vue";
    import SimpleMenu from "./SimpleMenu.vue";
    import TextureIcon from "vue-material-design-icons/Texture.vue";
    import TagIcon from "vue-material-design-icons/Tag.vue";
    import BookmarkIcon from "vue-material-design-icons/Bookmark.vue";
    import ChessRookIcon from "vue-material-design-icons/ChessRook.vue";

    export default {
        name: "MainMenu",
        components: {
            SimpleMenu,
            ToolMenu,
            AnimationIcon,
            FolderMultipleImageIcon,
            GridIcon,
            MyButton,
            StatusBar,
            TextureIcon,
            TagIcon,
            BookmarkIcon,
            ChessRookIcon
        },
        data: function() {
            return {
                routes: {
                    main: [
                        {
                            icon: GridIcon,
                            route: '/level/blocks',
                            highlight: /^\/level\//,
                            caption: 'Level',
                            title: 'Level editor'
                        },
                        {
                            icon: FolderMultipleImageIcon,
                            route: '/load-tiles',
                            caption: 'Tiles',
                            title: 'Load tileset and import wall and flat tiles'
                        },
                        {
                            icon: AnimationIcon,
                            route: '/build-anim',
                            caption: 'Anim.',
                            title: 'Make animated textures'
                        }
                    ],
                    tools: [
                        {
                            icon: TextureIcon,
                            route: '/level/blocks',
                            caption: 'Blocks',
                            title: 'Display the block browser'
                        },
                        {
                            icon: TagIcon,
                            route: '/level/tags',
                            caption: 'Tags',
                            title: 'Put tags on the map to add some in-game behavior'
                        },
                        {
                            icon: BookmarkIcon,
                            route: '/level/marks',
                            caption: 'Marks',
                            title: 'Put visual marks on the map'
                        },
                        {
                            icon: ChessRookIcon,
                            route: '/level/things',
                            caption: 'Things',
                            title: 'Place sprites on the map'
                        }
                    ]
                },
            }
        },

    }
</script>

<style scoped>

</style>