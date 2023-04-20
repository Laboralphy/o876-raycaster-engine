<template>
  <div class="ui-panel-window ui-size-60-90">
    <TitleAndCo title="Notes">
      <TypeList
          :types="getNoteTypes"
          :value="getNoteActiveTab"
          @selected="({ref}) => noteTypeSelected(ref)"
      ></TypeList>
    </TitleAndCo>
    <div v-if="getNotes.length > 0">
      <Item
        v-for="note in getNotes"
        :id="note.ref"
        :key="note.ref"
        icon="note"
        :name="note.ref in STRINGS.NOTES ? STRINGS.NOTES[note.ref].title : ('[' + note.ref + ' is undefined]')"
        @click="({id}) => noteClicked(id)"
      ></Item>
    </div>
    <div class="no-item-here typewriter" v-else>
      <span>Pas de note</span>
    </div>
  </div>
</template>

<script>
import strings from "../mixins/strings";
import TitleAndCo from "./TitleAndCo.vue";
import Item from "./Item.vue";
import TypeList from "./TypeList.vue";
import ui from "../mixins/ui";
import logic from "../mixins/logic";

export default {
  name: "Notes",
  components: {Item, TitleAndCo, TypeList},
  mixins: [strings, ui, logic],
  computed: {
    getNoteTypes: function () {
      return [
        {
          ref: 'journal',
          caption: this.STRINGS.NOTE_TYPES_JOURNAL
        },
        {
          ref: 'hint',
          caption: this.STRINGS.NOTE_TYPES_HINT
        }
      ]
    }
  },
  methods: {
    getNoteDataById: function(id) {
      return this.STRINGS.NOTES[id];
    },

    noteClicked: function(id) {
      this.setPhotoDetails({
        ...this.getNoteDataById(id),
        value: 0,
        visible: true
      });
    },

    noteTypeSelected: function(ref) {
      this.setNoteActiveType({ value: ref });
    }
  }
}
</script>

<style scoped>

</style>