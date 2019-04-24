<template>
    <div>
<!--            :style="getComputedStyle"-->
<!--            :class="getComputedClass"-->
<!--            @click="toggleSelect"-->
<!--    >-->
<!--        <div class="indicator" v-if="hasAnimation"><FilmstripIcon title="This tile is part of an animation"></FilmstripIcon></div>-->
    </div>
</template>

<script>

    /**
     * Tile est un composant qui affiche une tile du store
     * Il faut un identifiant de tile ou un content
     */

    import {createNamespacedHelpers} from 'vuex';
    import FilmstripIcon from "vue-material-design-icons/Filmstrip.vue";


    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');

    export default {
        name: "Tile",
        // components: {FilmstripIcon},
        // props: {
        //     type: String,
        //     tile: Number,
        //     content: String
        // },
        //
        // data: function() {
        //     return {
        //         selected: false
        //     };
        // },
        //
        // computed: {
        //     ...levelMapGetters([
        //         'getTileWidth',
        //         'getTileHeight',
        //         'getTile'
        //     ]),
        //
        //     hasAnimation: function() {
        //         const t = this.getTile(this.tile);
        //         return !!t && t.animation;
        //     },
        //
        //     getComputedHeight: function() {
        //         const t = this.getTile(this.tile);
        //         const sType = this.type || (!!t && t.type);
        //         switch (sType) {
        //             case 'f':
        //             case 'flat':
        //                 return this.getTileWidth; // fine
        //
        //             case 'w':
        //             case 'wall':
        //                 return this.getTileHeight;
        //
        //             default:
        //                 throw new Error('tile type is invalid : "' + this.type + '" should be "f" or "w"');
        //         }
        //     },
        //
        //     getComputedWidth: function() {
        //         return this.getTileWidth;
        //     },
        //
        //     getComputedStyle: function() {
        //         const t = this.getTile(this.tile);
        //         const oStyle = {
        //             width: this.getComputedWidth + 'px',
        //             height: this.getComputedHeight + 'px'
        //         };
        //         if (!!t) {
        //             oStyle['background-image'] = 'url(' + this.getTile(this.tile).content + ')';
        //         }
        //         if (this.content.length > 0) {
        //             oStyle['background-image'] = 'url(' + this.content + ')';
        //         }
        //         let aStyles = [];
        //         for (let sAttr in oStyle) {
        //             aStyles.push(sAttr + ':' + oStyle[sAttr]);
        //         }
        //         return aStyles.join('; ');
        //     },
        //
        //     getComputedClass: function() {
        //         const aClasses = [
        //             'tile',
        //             this.selected ? 'selected' : ''
        //         ];
        //         return aClasses.filter(c => c.length > 0).join(' ');
        //     }
        // },
        //
        // methods: {
        //     toggleSelect: function() {
        //         this.selected = !this.selected;
        //         this.$emit('selected', {value: this.selected});
        //     },
        // }
    }
</script>

<style scoped>
    div.indicator {
        font-size: 2em;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 15%;
        width: 1em;
    }

    div.tile {
        border: solid 0.4em #00C;
        margin: 0.3em;
        cursor: pointer;
        user-select: none;
        display: inline-block;
    }

    div.tile:hover {
        border-color: #55F;
        filter: brightness(140%);
    }

    div.tile.selected {
        border-color: limegreen;
        filter: brightness(120%);
    }

    div.tile.selected:hover {
        border-color: #8F8;
        filter: brightness(140%);
    }
</style>