<template>
  <div class="ui-panel-window ui-size-60-90">
    <TitleAndCo title="Inventaire">
      <ItemTypes></ItemTypes>
    </TitleAndCo>
    <div class="inv-container"> <!-- QUEST ITEMS -->
      <Item
          v-for="item in getInventoryContent"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :icon="item.icon"
          @click="({id}) => questItemClicked(id)"></Item>
    </div>
  </div>
</template>

<script>
import strings from "./mixins/strings";
import TitleAndCo from "./TitleAndCo.vue";
import {createNamespacedHelpers} from 'vuex';
import Item from "./Item.vue";
import * as UI_MUTATIONS from "../store/modules/ui/mutation-types";
import ItemTypes from "./ItemTypes.vue";

const {mapGetters: logicMapGetters} = createNamespacedHelpers('logic');
const {mapMutations: uiMapMutations, mapGetters: uiMapGetters} = createNamespacedHelpers('ui');

export default {
  name: "Inventory",
  components: {ItemTypes, Item, TitleAndCo},
  mixins: [strings],

  computed: {
    ...logicMapGetters([
        'getQuestItems',
        'getItemData'
    ]),
    ...uiMapGetters([
        'getInventoryActiveTab'
    ]),

    getInventoryContent: function() {
      const sActiveType = this.getInventoryActiveTab;
      return this
          .getQuestItems
          .map(id => this.getItemDataById(id))
          .filter(item => sActiveType === 'all' || item.type === sActiveType);
    }
  },

  methods: {
    ...uiMapMutations({
      setPhotoDetails: UI_MUTATIONS.SET_PHOTO_DETAILS
    }),

    getItemDataById: function(id) {
      const oItemStrData = this.STRINGS.ITEMS[id];
      const oItemData = this.getItemData.find(item => item.id === id);
      const name = oItemStrData.name;
      const icon = oItemData.icon;
      const type = oItemData.type;
      const description = oItemStrData.description;
      const sThumbnail = 'assets/uigfx/thumbnails/' + oItemData.thumbnail + '.jpg';
      return {
        id,
        name,
        icon,
        type,
        description,
        content: sThumbnail
      }
    },

    questItemClicked: function(id) {
      this.setPhotoDetails({
        ...this.getItemDataById(id),
        value: 0,
        visible: true
      });
    }

  }
}
</script>

<style scoped>
div.inv-container {
  overflow: auto;
  padding: 1%;
  margin: 0;
  width: 98%;
  height: 90%;
}

p.description {
  margin-left: 2em;
  padding-right: 1.2em;
  text-align: justify;
  font-size: 0.9em;
  color: black;
  font-family: "OldNewspaperTypes", Courier, monospace;
}

</style>