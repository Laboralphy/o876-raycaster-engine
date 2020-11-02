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
            <p>In an online context, the Map editor is only available to <b>identified users</b>. So they'll have access to their own workspace.</p>
            <nav>
              <ul v-if="isAccessGranted">
                <li><button class="green" @click="openMapEditor()">Open Map Editor</button></li>
              </ul>
              <ul v-else>
                <li><button class="disabled" disabled="disabled">Open Map Editor</button></li>
              </ul>
            </nav>
            <span class="note" v-if="isAccessDenied">You must be logged in to use the Map Editor.</span>
          </div>
        </div>
    </div>
</template>

<script>
    import storeMixin from '../../mixins/store';
    export default {
        name: "MapEditPage",

        mixins: [storeMixin],

        computed: {
          isAccessDenied: function () {
            return this.isOnline && !this.isUserAuthenticated
          },
          isAccessGranted: function () {
            return this.isOffline || this.isUserAuthenticated
          }
        },

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