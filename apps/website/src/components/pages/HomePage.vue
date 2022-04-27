<template>
  <div>
    <div class="row">
      <div class="col lg-6 lg-offset-3">
          <h3>Current active project</h3>
          <p>Haunted village exploration / Exorcise vengefull spirits with a camera.</p>
      </div>
      <div class="col lg-6 lg-offset-3">
          <nav>
            <ul>
              <li>
                <button class="green" @click="runProject"><img src="../../../assets/images/launcher-mansion.jpg" /></button>
              </li>
            </ul>
          </nav>
      </div>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

const {mapGetters: mainGetters} = createNamespacedHelpers('main');

export default {
  name: "HomePage",
  data: function () {
    return {
      gameActionPrefix: 'game'
    }
  },
  methods: {
    runProject: function () {
      window.location.href = this.gameActionPrefix;
    }
  }
}
</script>

<style scoped>
figure.logo {
  display: inline-block;
  height: 10em;
  width: 10em;
}

figure.logo figcaption {
  text-align: center;
}
</style>