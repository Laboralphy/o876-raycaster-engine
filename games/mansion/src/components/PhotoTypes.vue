<template>
  <TypeList
      :types="getTypeList"
      @selected="({ref}) => selected(ref)"
  >
  </TypeList>
</template>

<script>
import STRINGS from '../mixins/strings';
import TypeList from "./TypeList.vue";
import album from "../mixins/album";

export default {
  name: "PhotoTypes",
  components: {TypeList},
  mixins: [STRINGS, album],

  props: {
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    getTypeList: function () {
      return [
        {
          ref: 'clue',
          caption: this.STRINGS.PHOTO_TYPES_CLUE,
        },
        {
          ref: 'wraith',
          caption: this.STRINGS.PHOTO_TYPES_WRAITH,
        },
        {
          ref: 'art',
          caption: this.STRINGS.PHOTO_TYPES_ART,
        },
        {
          ref: 'ambient',
          caption: this.STRINGS.PHOTO_TYPES_AMBIENT,
        },
        {
          ref: 'archive',
          caption: this.STRINGS.PHOTO_TYPES_ARCHIVE,
        }
      ]
    }
  },

  methods: {
    selected: function (type) {
      this.setActiveType({value: type});
    }
  }
}
</script>

<style scoped>

</style>
