<template>
    <div
            :style="getComputedStyle"
            :class="getComputedClass"
            @click="toggleSelect"
            :draggable="true"
            @dragstart="dragstartEvent"
            @dragenter="dragenterEvent"
            @dragleave="dragleaveEvent"
            @dragover="dragoverEvent"
            @drop="dropEvent"
    >
        <div class="indicator" v-if="anim"><FilmstripIcon title="This tile is part of an animation"></FilmstripIcon></div>
    </div>
</template>

<script>
    import FilmstripIcon from "vue-material-design-icons/Filmstrip.vue";

    export default {
        name: "Tile",
        components: {FilmstripIcon},
        props: {
            tile: {
                type: Number,
                required: true
            },
            width: Number,
            height: Number,
            content: String,
            anim: {
                type: Boolean,
                default: false,
                required: false
            },
            selectable: {
                type: Boolean,
                default: true,
                required: false
            },
            draggable: {
                type: Boolean,
                default: true,
                required: false
            },
            dropzone: {
                type: Boolean,
                default: false,
                required: false
            }
        },

        data: function() {
            return {
                selected: false,
                dragover: false
            };
        },

        computed: {
            /**
             * Rendu de la chaine CSS
             * @return {string}
             */
            getComputedStyle: function() {
                const oStyle = {
                    width: this.width + 'px',
                    height: this.height + 'px',
                    'background-image': 'url(' + this.content + ')'
                };
                let aStyles = [];
                for (let sAttr in oStyle) {
                    aStyles.push(sAttr + ':' + oStyle[sAttr]);
                }
                return aStyles.join('; ');
            },

            getComputedClass: function() {
                const aClasses = [
                    'tile',
                    this.selected ? 'selected' : '',
                    this.dragover ? 'dragover' : ''
                ];
                return aClasses.filter(c => c.length > 0).join(' ');
            }
        },

        methods: {
            /**
             * On clique sur cette tile : il faut inverse l'indicateur de selection
             */
            toggleSelect: function() {
                this.selected = this.selectable && !this.selected;
                this.$emit('select', {value: this.selected});
            },

            /**
             * On commence à dragger cette tile. une petite initialisation est donc de rigueur
             * @param event
             */
            dragstartEvent: function(event) {
                if (this.draggable) {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text', this.tile.toString());
                }
            },

            /**
             * Un objet vient d'entrer dans la zone délimiter par cette tile
             * si cette tile est déclarée dropzone, on réagit par un changement de classe
             * @param event
             */
            dragenterEvent: function() {
                if (this.dropzone) {
                    this.dragover = true;
                }
            },

            /**
             * un objet vient de quitter la zone délimitée par cette tile
             * si cette tile est déclarée dropzone, on réagit par un changement de classe
             * @param event
             */
            dragleaveEvent: function() {
                if (this.dropzone) {
                    this.dragover = false;
                }
            },

            /**
             * un objet survole cette dropzone
             * @param event
             */
            dragoverEvent: function(event) {
                if (this.dropzone) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                }
            },

            /**
             * On a laché un oobjet dans la zone délimité par cette tile
             * @param event
             */
            dropEvent: function(event) {
                if (this.dropzone) {
                    event.preventDefault();
                    this.dragover = false;
                    const idToMove = parseInt(event.dataTransfer.getData('text'));
                    this.$emit('drop', {incoming: idToMove})
                }
            }
        }
    }
</script>

<style scoped>
    div.indicator {
        font-size: 2em;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 15%;
        width: 1em;
        position: absolute;
    }

    div.tile {
        border: solid 0.4em #00C;
        margin: 0.3em;
        cursor: pointer;
        user-select: none;
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center;
        filter: brightness(100%);
    }

    div.tile:hover {
        border-color: #55F;
        filter: brightness(140%);
    }

    div.tile.selected {
        border-color: lime;
        filter: brightness(120%);
    }

    div.tile.selected:hover {
        border-color: #8F8;
        filter: brightness(140%);
    }

    @keyframes dragover-pulse {
        from {
            border-color: lime;
        }
        to {
            border-color: black;
        }
    }

    div.tile.dragover {
        animation: dragover-pulse 777ms alternate infinite ease-in-out;
    }
</style>