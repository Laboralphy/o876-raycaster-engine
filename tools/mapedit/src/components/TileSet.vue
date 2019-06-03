<template>
    <div>
        <Tile
                v-for="t in tiles"
                :content="t.content"
                :width="width"
                :height="height"
                :key="t.id"
                :tile="t.id"
                :anim="!!t.animation"
                :draggable="true"
                :dropzone="true"
                :selectable="false"
                @drop="({incoming}) => handleDrop(t.id, incoming)"
                @select="({value}) => setTileSelection(t.id, value)"
        ></Tile>
    </div>
</template>

<script>
    export default {
        name: "TileSet",

        props: {
            width: {
                type: Number,
                required: false,
                default: 64
            },
            height: {
                type: Number,
                required: false,
                default: 64
            },
            tiles: {
                type: Array,
                required: true
            },
            default: {
                type: Boolean,
                required: false,
                default: null,
            }
        },

        data: function() {
            return {
                selected: this.default,
            };
        },

        watch: {
            selected: {
                handler: function(newValue, oldValue) {
                    this.$children.forEach(c => {
                        c.selected = c.$props.tile === newValue;
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>