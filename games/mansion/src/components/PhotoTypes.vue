<template>
  <TypeList
      :types="getTypeList"
      @selected="({ref}) => selected(ref)"
  >
  </TypeList>
</template>

<script>
import STRINGS from './mixins/strings';
import * as MUTATIONS from '../store/modules/album/mutation-types';
import {createNamespacedHelpers} from 'vuex';
import TypeList from "./TypeList.vue";

const {mapGetters: albumMapGetters, mapMutations: albumMapMutations} = createNamespacedHelpers('album');

export default {
  name: "PhotoTypes",
  components: {TypeList},
  mixins: [STRINGS],

  props: {
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...albumMapGetters([
      'getPhotoTypes',
      'getActiveType'
    ]),
    getTypeList: function () {
      return [
        {
          ref: 'debug',
          caption: this.STRINGS.PHOTO_TYPES_DEBUG,
        },
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
    ...albumMapMutations({
      setActiveType: MUTATIONS.SET_ACTIVE_TYPE
    }),
    selected: function (type) {
      this.setActiveType({value: type});
    }
  }
}
</script>

<style scoped>

</style>