<template>
    <div class="ui-panel-window ui-size-60-90 album typewriter">
        <TitleAndCo :title="STRINGS.MAIN_TAB_ALBUM">
            <PhotoTypes></PhotoTypes>
        </TitleAndCo>
        <div class="photo-container" v-if="getPhotos.length > 0">
            <Photo
                v-for="photo in getPhotos"
                :key="photo.id"
                :content="photo.content"
                :caption="(photo.ref in STRINGS.PHOTOS) ? STRINGS.PHOTOS[photo.ref].title : '[' + photo.ref + ']'"
                :gray="getActiveType === 'archive'"
                @click="photoClicked(photo.id)"
            ></Photo>
        </div>
        <div v-else class="no-item-here">
            <span>{{ STRINGS.ALBUM_TAB_EMPTY }}</span>
        </div>
    </div>
</template>

<script>
    import STRINGS from '../mixins/strings';

    import Photo from "./Photo.vue";
    import PhotoTypes from "./PhotoTypes.vue";
    import TitleAndCo from "./TitleAndCo.vue";
    import ui from "../mixins/ui";
    import album from "../mixins/album";

    export default {
        name: "Album",
        mixins: [STRINGS, ui, album],
        components: {TitleAndCo, Photo, PhotoTypes},

        mounted: function () {
            this.setActiveType({value: this.getFirstWorthyActiveType})
        },
        methods: {
              photoClicked: function(id) {
                  const {ref, value, content} = this.getPhotos.find(p => p.id === id);
                  const oPhotoData = this.STRINGS.PHOTOS[ref];
                  if (ref === undefined) {
                      throw new Error('this photo is unknown : id ' + id + ' - ref ' + ref);
                  }
                  const title = oPhotoData.title;
                  const description = oPhotoData.description;
                  this.setPhotoDetails({
                      title,
                      description,
                      content,
                      value,
                      visible: true
                  });
              }
          }
    }
</script>

<style scoped>
    div.photo-container {
        overflow: auto;
        padding: 1%;
        margin: 0;
        width: 98%;
        height: 90%;
    }

    div.photo-details {
        height: 33%;
    }
</style>