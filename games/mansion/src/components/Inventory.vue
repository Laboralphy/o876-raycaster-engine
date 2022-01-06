<template>
  <div class="ui-panel-window ui-size-60-90">
    <TitleAndCo title="Inventaire">
      <ItemTypes></ItemTypes>
    </TitleAndCo>
    <div class="inv-container" v-if="getInventoryContent.length > 0">
      <Item
          v-for="(item, i) in getInventoryContent"
          :key="item.id + ':' + i"
          :id="item.id"
          :name="item.name"
          :icon="item.icon"
          @click="({id}) => inventoryItemClicked(id)"></Item>
    </div>
    <div v-else class="no-item-here typewriter">
      <span>{{ STRINGS.INVENTORY_TAB_EMPTY }}</span>
    </div>
  </div>
</template>

<script>
import strings from "../mixins/strings";
import TitleAndCo from "./TitleAndCo.vue";
import Item from "./Item.vue";
import ItemTypes from "./ItemTypes.vue";
import ui from "../mixins/ui";
import logic from "../mixins/logic";

export default {
  name: "Inventory",
  components: {ItemTypes, Item, TitleAndCo},
  mixins: [strings, ui, logic],

  computed: {
    getInventoryContent: function() {
      const sActiveType = this.getInventoryActiveTab;
      return this
          .getInventoryItems
          .map(id => this.getItemDataById(id))
          .filter(item => sActiveType === 'all' || item.type === sActiveType);
    }
  },

  methods: {
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

    inventoryItemClicked: function(id) {
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