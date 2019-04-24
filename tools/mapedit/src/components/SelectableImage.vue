<template>
    <img
        :class="getMainClass"
        :src="src"
        @click="toggleSelect"
        :draggable="true"
        @dragstart="dragstartEvent"
        @dragenter="dragenterEvent"
        @dragleave="dragleaveEvent"
        @dragover="dragoverEvent"
        @drop="dropEvent"
    />
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as ACTION from '../store/modules/level/action-types';

    const {mapActions: levelMapAcctions} = createNamespacedHelpers('level');

    export default {
        name: "SelectableImage",
        props: {
            src: String,
            tileId: Number,
            draggable: Boolean
        },

        data: function() {
            return {
                selected: false,
                dragover: false,
            }
        },

        computed: {
            getMainClass: function() {
                const aClasses = ['tile', 'r'];
                if (this.selected) {
                    aClasses.push('selected');
                }
                return aClasses.join(' ');
            }
        },

        methods: {
            ...levelMapAcctions({
                reorderTile: ACTION.REORDER_TILE
            }),
            toggleSelect: function() {
                this.selected = !this.selected;
                this.$emit('selected', {value: this.selected});
            },

            dragstartEvent: function(event) {
                if (this.draggable) {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text', this.tileId.toString());
                }
            },

            /**
             * Cette image recoit, en dragover, une autre image, il faut indiquer qu'on accepter le drop
             * ce qui conduira à l'inclusion de l'image droppée à la place de cette image
             * @param event
             */
            dragenterEvent: function(event) {
                if (this.draggable) {
                    this.dragover = true;
                }
            },

            dragleaveEvent: function(event) {
                if (this.draggable) {
                    this.dragover = false;
                }
            },

            dragoverEvent: function(event) {
                if (this.draggable) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                }
            },

            dropEvent: function(event) {
                event.preventDefault();
                this.dragover = false;
                const idMine = this.tileId;
                const idToMove = parseInt(event.dataTransfer.getData('text'));
                console.log('move', idToMove, 'to', idMine);
                this.reorderTile({idSource: idToMove, idTarget: idMine});
                // déclencher le déplacement de idToMove à la place de idMine
            }
        }
    }
</script>

<style scoped>
    .tile {
        border: solid 0.4em #00C;
        margin: 0.3em;
        cursor: pointer;
        user-select: none;
    }

    .tile:hover {
        border-color: #55F;
        filter: brightness(140%);
    }

    .tile.selected {
        border-color: limegreen;
        filter: brightness(120%);
    }

    .tile.selected:hover {
        border-color: #8F8;
        filter: brightness(140%);
    }
</style>