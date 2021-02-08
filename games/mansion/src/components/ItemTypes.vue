<template>
  <TypeList
    :types="getTypeList"
    @selected="({ref}) => selected(ref)"
  ></TypeList>
</template>

<script>
import STRINGS from '../mixins/strings';
import TypeList from "./TypeList.vue";
import ui from "../mixins/ui";

export default {
  name: "ItemTypes",
  components: {TypeList},
  mixins: [STRINGS, ui],

  computed: {
    getTypeList: function () {
      return [
        {
          ref: 'all',
          caption: this.STRINGS.ITEM_TYPES_ALL,
        },
        {
          ref: 'quest',
          caption: this.STRINGS.ITEM_TYPES_QUEST,
        },
        {
          ref: 'key',
          caption: this.STRINGS.ITEM_TYPES_KEY,
        },
        {
          ref: 'book',
          caption: this.STRINGS.ITEM_TYPES_BOOK,
        }
      ];
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