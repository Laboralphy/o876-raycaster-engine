<template>
    <figure>
        <figcaption>{{ label }} <span @click="clearTile" class="close-button"><CloseCircleIcon></CloseCircleIcon></span></figcaption>
        <img
                :src="tileId !== null ? getTile(this.tileId).content : ''"
                :class="getMainClass"
                :width="width"
                :height="height"
                @dragenter="dragenterEvent"
                @dragleave="dragleaveEvent"
                @dragover="dragoverEvent"
                @drop="dropEvent"
        />
        <figcaption>
            <MyButton>
                <PlayIcon></PlayIcon>anim.
            </MyButton>
        </figcaption>
    </figure>
</template>

<script>
    import {createNamespacedHelpers} from'vuex';

    import MyButton from "./MyButton.vue";
    import CloseCircleIcon from "vue-material-design-icons/CloseCircle.vue";
    import PlayIcon from "vue-material-design-icons/Play.vue";


    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');


    export default {
        name: "DropZoneCanvas",
        components: {PlayIcon, CloseCircleIcon, MyButton},
        props: {
            width: Number,
            height: Number,
            label: String,
            cardinal: String,
            tile: Number
        },

        data: function() {
            return {
                dragover: false,
                tileId: this.tile,
            };
        },

        watch: {
            tileId: function(value, oldValue) {
                if (value !== oldValue) {
                    this.$emit('change', value);
                }
            }
        },

        computed: {
            ...levelMapGetters([
                'getTile'
            ]),

            getMainClass: function() {
                const aClasses = [
                    'tile'
                ];
                if (this.dragover) {
                    aClasses.push('drag-over');
                }
                return aClasses.join(' ');
            },
        },

        methods: {
            dragenterEvent: function(event) {
                this.dragover = true;
            },

            dragleaveEvent: function(event) {
                this.dragover = false;
            },

            dragoverEvent: function(event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
            },

            dropEvent: function(event) {
                event.preventDefault();
                this.dragover = false;
                this.tileId = parseInt(event.dataTransfer.getData('text'));
            },

            clearTile: function() {
                this.tileId = null;
            }
        }
    }
</script>

<style scoped>
    canvas.tile {
        border: solid 4px black;
    }

    canvas.tile.drag-over {
        border-color: limegreen;
    }

    img.tile {
        border: solid 4px black;
    }

    img.tile.drag-over {
        border-color: limegreen;
    }

    span.close-button {
        color: #880000;
        font-weight: bold;
        font-size: 1.2em;
        cursor: pointer;
    }

    span.close-button:hover {
        color: #FF0000;
    }
</style>