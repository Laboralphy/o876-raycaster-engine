<template>
  <section class="game-story">
    <div class="ui-menu-window ui-size-50-90 rounded">
      <GenericBox
          footer="4em"
          header="6em"
      >
        <template v-slot:header>
          <div class="container">
            <h1 class="manuscript">{{ STRINGS.INTRO_MAP_TITLE }}</h1>
            <hr/>
          </div>
        </template>
        <section :class="'content ' + getFadeClass" :style="'transition-duration: ' + FADE_DURATION + 'ms'">
          <div class="photo">
            <img @load="fadeIn()" ref="splash" :src="getCurrentImage"/>
          </div>
          <div class="container manuscript">
            <p>
              {{ STRINGS.INTRO_MAP_TASKS[splashIndex] }}
            </p>
          </div>
        </section>
        <template v-slot:footer>
          <div class="container typewriter">
            <hr/>
            <div class="commands">
              <button :disabled="!canNavigate" class="typewriter" @click="rewind">{{ STRINGS.COMMAND_CAPTION_PREV }}</button>
              <button :disabled="!canNavigate" class="typewriter" @click="forward">{{ STRINGS.COMMAND_CAPTION_NEXT }}</button>
            </div>
          </div>
        </template>
      </GenericBox>
    </div>
  </section>

</template>

<script>
import STRINGS from '../../mixins/strings';
import UIMixin from '../../mixins/ui';

import GenericBox from "../GenericBox.vue";

export default {
  name: "TitleStory",
  components: {GenericBox},
  mixins: [STRINGS, UIMixin],
  data: function() {
    return {
      PHASE_LOADING: 0,
      PHASE_FADE_IN: 1,
      PHASE_SHOWING: 2,
      PHASE_FADE_OUT: 3,

      FADE_DURATION: 400,

      splashes: {
        todo: "assets/uigfx/intro/intro-todo.jpg",
        map: "assets/uigfx/intro/intro-map.jpg",
        cult: "assets/uigfx/intro/intro-cult.jpg",
        paintings: "assets/uigfx/intro/intro-paintings.jpg",
        books: "assets/uigfx/intro/intro-books.jpg",
        village: "assets/uigfx/intro/intro-village.jpg"
      },
      order: [
        'todo', 'map', 'village', 'paintings', 'books', 'cult'
      ],
      splashIndex: 0,
      fadingPhase: 0
    }
  },
  computed: {
    getFadeClass: function () {
      switch (this.fadingPhase) {
        case this.PHASE_FADE_IN: // fade in
        case this.PHASE_SHOWING:
          return 'fade in';

        case this.PHASE_FADE_OUT: // fade in
        case this.PHASE_LOADING:
          return 'fade out';
      }
    },
    canNavigate: function() {
      return this.fadingPhase === this.PHASE_SHOWING;
    },
    getCurrentImage: function () {
      return this.splashes[this.order[this.splashIndex]];
    }
  },
  methods: {

    /**
     * Effectue une pause
     * @param nTime
     * @return {Promise<unknown>}
     */
    pause: function(nTime) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), nTime);
      })
    },

    fadeIn: async function() {
      this.fadingPhase = this.PHASE_FADE_IN;
      await this.pause(this.FADE_DURATION + 120);
      this.fadingPhase = this.PHASE_SHOWING;
    },

    fadeOut: async function() {
      this.fadingPhase = this.PHASE_FADE_OUT;
      await this.pause(this.FADE_DURATION + 120);
    },

    /**
     * Change l'index de l'image d'illustration par fondu au noir
     * @param iIndex {number}
     * @return {Promise<void>}
     */
    setImageIndex: async function (iIndex) {
      await this.fadeOut();
      this.splashIndex = iIndex;
      // l'IMG va positionner fadingPhase à PHASE_FADE_IN dès l'image chargée
    },

    forward: function() {
      if (this.splashIndex < (this.order.length - 1)) {
        this.setImageIndex(this.splashIndex + 1);
      } else {
        ++this.phase;
      }
    },

    rewind: function() {
      if (this.splashIndex > 0) {
        this.setImageIndex(this.splashIndex - 1);
      } else {
        --this.phase;
      }
    }
  }
}
</script>

<style scoped>

.fade {
  transition-property: opacity;
  transition-timing-function: linear;
}

.fade.in {
  opacity: 1;
}

.fade.out {
  opacity: 0;
}

section.game-story {
  font-size: 1.2em;
  font-weight: normal;
  color: rgb(52, 51, 50);
  text-align: left;
}

section.game-story h1 {
  font-size: 2em;
  font-weight: bolder;
}

.ui-menu-window {
  background: antiquewhite;
}

div.photo img {
  margin: auto;
  border: solid 0.2em black;
  width: 80%;
  box-shadow: 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3);
}

div.commands button {
  font-size: 1em;
}


div.container {
  padding-left: 1em;
  padding-right: 1em;
}

div.ui-menu-window {
  background-color: antiquewhite;
}

div.container h1 {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}

div.rounded {
  border-radius: 0.5em;
}

</style>
