<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>The map editor</h3>
            </div>
        </div>
        <div class="row">
          <div class="col lg-12" v-if="isOffline || (isOnline && isUserAuthenticated)">
            <p>The Map Editor is a web software that allows you to design your own maps for a Raycaster Game Project.</p>
            <nav>
              <ul>
                <li><button class="green" @click="openMapEditor()">Open Map Editor</button></li>
              </ul>
            </nav>
          </div>
          <div class="col lg-12" v-else>
            <p>The Map Editor is a web software that allows you to design your own maps for a Raycaster Game Project.</p>
            <p>While online, the Map editor is only available to :</p>
            <ul>
              <li>Registred users (They'll have their own workspace).</li>
              <li>Anonymous users (They'll share a common anonymous workspace).</li>
            </ul>
            <nav>
              <ul>
                <li><button class="green" @click="openMapEditor()">Open Map Editor</button></li>
              </ul>
            </nav>
          </div>
        </div>
    </div>
</template>

<script>
    import storeMixin from '../mixins/store';
    export default {
        name: "MapEditPage",

        mixins: [storeMixin],

        methods: {
            openMapEditor: function() {
                window.location.href = '/mapedit';
            }
        }
    }


</script>

<style scoped>
    img.screenshot {
        width: 32em;
    }

    div.center {
        text-align: center;
    }
</style>