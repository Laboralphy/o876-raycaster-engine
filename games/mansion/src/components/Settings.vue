<template>
  <div class="ui-panel-window ui-size-60-90">
    <TitleAndCo :title="STRINGS.MAIN_TAB_SETTINGS">
    </TitleAndCo>
    <div class="ui-setting-panel">
      <div>{{ STRINGS.SETTINGS_MOUSE_SENS_LABEL }}</div>
      <div><input @change="changeMouseFactor" ref="slideMouse" type="range" min="1" max="100" value="50" class="slider"></div>
    </div>
    <div class="ui-setting-panel">
      <div>{{ STRINGS.SETTINGS_MUSIC_VOLUME_LABEL }}</div>
      <div><input @change="changeMusicVolume" ref="slideMusic" type="range" min="1" max="100" value="50" class="slider"></div>
    </div>
    <div class="ui-setting-panel">
      <div>{{ STRINGS.SETTINGS_SFX_VOLUME_LABEL }}</div>
      <div><input @change="changeSFXVolume" ref="slideSFX" type="range" min="1" max="100" value="50" class="slider"></div>
    </div>
  </div>
</template>

<script>
import strings from "../mixins/strings";
import TitleAndCo from "./TitleAndCo.vue";
import ui from "../mixins/ui";
import logic from "../mixins/logic";

export default {
  name: "Settings",
  components: {TitleAndCo},
  mixins: [strings, ui, logic],

  computed: {
    mouseFactor: {
      get: function () {
        return this.getSettingMouseFactor
      },
      set: function (value) {
        this.setSettingMouseFactor({ value })
      }
    },
    musicVolume: {
      get: function () {
        return this.getSettingMusicVolume
      },
      set: function (value) {
        this.setSettingMusicVolume({ value })
      }
    },
    sfxVolume: {
      get: function () {
        return this.getSettingSFXVolume
      },
      set: function (value) {
        this.setSettingSFXVolume({ value })
      }
    }
  },

  mounted() {
    this.$refs.slideMouse.value = this.mouseFactor
    this.$refs.slideMusic.value = this.musicVolume
    this.$refs.slideSFX.value = this.sfxVolume
  },

  methods: {
    changeMouseFactor: function (oEvent) {
      this.mouseFactor = oEvent.target.value
    },

    changeMusicVolume: function (oEvent) {
      this.musicVolume = oEvent.target.value
    },

    changeSFXVolume: function (oEvent) {
      this.sfxVolume = oEvent.target.value
    }
  }
}
</script>

<style scoped>

div.ui-setting-panel {
  margin-left: 2em;
  padding-right: 1.2em;
  margin-top: 2em;
  text-align: justify;
  font-size: 0.9em;
  color: black;
  font-family: "OldNewspaperTypes", Courier, monospace;
}

</style>