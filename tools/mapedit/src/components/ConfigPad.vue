<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            :caption="getTitle"
    >
        <template v-slot:toolbar>
        </template>
        <div v-if="selectedFamily === 'wall'">
            <SelectableImage
                    v-for="image in getWallTiles"
                    :key="image.id"
                    :src="image.content"
            ></SelectableImage>
        </div>
        <div v-if="selectedFamily === 'flat'">
            <SelectableImage
                    v-for="image in getFlatTiles"
                    :key="image.id"
                    :src="image.content"
            ></SelectableImage>
        </div>
    </Window>
</template>

<script>
    export default {
        name: "ConfigPad"
    }
</script>

<style scoped>

</style>