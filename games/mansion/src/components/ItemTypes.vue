<template>
  <TypeList
    :types="getTypeList"
    @selected="({ref}) => selected(ref)"
  ></TypeList>
</template>

<script>
import STRINGS from './mixins/strings';
import * as MUTATIONS from '../store/modules/ui/mutation-types';
import {createNamespacedHelpers} from 'vuex';
import TypeList from "./TypeList.vue";

const {mapGetters: uiMapGetters, mapMutations: uiMapMutations} = createNamespacedHelpers('ui');
const {mapGetters: logicMapGetters, mapMutations: logicMapMutations} = createNamespacedHelpers('logic');

export default {
  name: "ItemTypes",
  components: {TypeList},
  mixins: [STRINGS],

  computed: {
    ...uiMapGetters([
      'getInventoryActiveTab'
    ]),
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
    ...uiMapMutations({
      setActiveType: MUTATIONS.SET_ITEM_TYPE_ACTIVE_TYPE
    }),
    selected: function (type) {
      this.setActiveType({value: type});
    }
  }
}
</script>

<style scoped>

</style>