<template>
    <div class="full-right">
        <Siblings>
            <SiblingButton title="Blocks">
                <TextureIcon decorative title="Blocks"></TextureIcon>
                <span>Blocks</span>
            </SiblingButton>
            <SiblingButton title="Tags">
                <TagIcon decorative title="Tags"></TagIcon>
                <span>Tags</span>
            </SiblingButton>
            <SiblingButton title="Marks">
                <BookmarkIcon decorative title="Marks"></BookmarkIcon>
                <span>Marks</span>
            </SiblingButton>
        </Siblings>
    </div>
</template>

<script>
    import Siblings from "./Siblings.vue";
    import SiblingButton from "./SiblingButton.vue";
    import TextureIcon from "vue-material-design-icons/Texture.vue";
    import TagIcon from "vue-material-design-icons/Tag.vue";
    import BookmarkIcon from "vue-material-design-icons/Bookmark.vue";
    import EyeCircleIcon from "vue-material-design-icons/EyeCircle.vue";
    export default {
        name: "ToolMenu",
        components: {EyeCircleIcon, BookmarkIcon, TagIcon, TextureIcon, SiblingButton, Siblings}
    }
</script>

<style scoped>
    div.full-right {
        display: inline-block;
        float: right;
    }
</style>