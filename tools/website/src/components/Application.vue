<template>
    <div class="pad">
        <div class="container">
            <Card color="blue" title="O876 Raycaster Game Engine">
                <nav>
                    <ul>
                        <li><button @click="$router.push('/')">Home</button></li>
                        <li><button @click="$router.push('/mapedit')">Map editor</button></li>
                        <li><button @click="$router.push('/tech')">Docs</button></li>
                        <li><button @click="$router.push('/examples')">Demos</button></li>
                        <li><button @click="$router.push('/about')">About</button></li>
                        <li v-if="isOnline"> - </li>
                        <li v-if="isOnline && isUserAuthPending"><button class="disabled">checking</button></li>
                        <li v-else-if="isOnline && !isUserAuthenticated"><button class="blue" @click="$router.push('/login')">Sign in</button></li>
                        <li v-else-if="isOnline && isUserAuthenticated"><button class="green" @click="$router.push('/login')">{{ getUserDisplayName }}</button></li>
                    </ul>
                </nav>
                <router-view></router-view>
            </Card>
        </div>
    </div>
</template>

<script>
    import Card from "./Card.vue";
    import HomeIcon from "vue-material-design-icons/Home.vue";

    import storeMixin from '../mixins/store';

    export default {
        name: "Application",
        components: {HomeIcon, Card},
        mixins: [storeMixin],
        created: async function() {
          await this.checkOnline();
          if (this.isOnline) {
            this.checkUserAuth();
          }
        },
        watch: {
          $route: {
            handler: function(to, from) {
              // checks if user is connected
              if (to.path === '/' && this.isOnline) {
                this.checkUserAuth();
              }
            },
            immediate: false
          }
        }
    }
</script>

<style scoped>
    div.pad {
        padding: 0.85em;
    }
</style>