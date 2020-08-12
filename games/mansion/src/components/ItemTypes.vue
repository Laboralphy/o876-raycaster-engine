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
ul.tab-list {
  margin: 0;
}

ul.tab-list > li {
  display: inline-block;
  background-color: #8b4513;
  border: solid thin #251205;
  border-radius: 0.25em;
  color: #b58868;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
  font-size: 0.8em;
  padding: 0.125em 0.35em;
}

ul.tab-list > li:hover {
  display: inline-block;
  background-color: #d76b1d;
  color: #caaa93;
  border: solid thin #381e0d;
  cursor: pointer;
}

ul.tab-list > li.selected,
ul.tab-list > li.selected:hover {
  display: inline-block;
  background-color: #e0ab84;
  color: #f8f8f7;
  border: solid thin #5a3b26;
  cursor: default;
}
</style>