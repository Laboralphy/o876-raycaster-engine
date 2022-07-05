<template>
    <div class="pad">
        <div class="container">
            <Card color="blue" title="O876 Raycaster Game Engine">
                <nav>
                    <ul>
                        <li><button @click="$router.push('/')">Home</button></li>
                        <li v-if="editorStatus"><button @click="$router.push('/pm')">Project manager</button></li>
                        <li v-if="editorStatus"><button @click="$router.push('/mapedit')">Map editor</button></li>
                        <li><button @click="$router.push('/tech')">Docs</button></li>
                        <li><button @click="$router.push('/demos')">Demos</button></li>
                        <li><button @click="$router.push('/about')">About</button></li>
                    </ul>
                </nav>
                <router-view></router-view>
                <hr class="footpage-copyright"/>
                <div class="footpage-copyright">Opensource project created by <b>Laboralphy</b>.</div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Card from "./Card.vue";
    import HomeIcon from "vue-material-design-icons/Home.vue";
    import { fetchEditorStatus } from "../libs/fetch-editor-status";

    export default {
        name: "Application",
        components: {HomeIcon, Card},
        data: () => ({
          editorStatus: false
        }),
        async beforeMount() {
          this.editorStatus = await fetchEditorStatus()
        }
    }
</script>

<style scoped>
    div.pad {
        padding: 0.85em;
    }

    hr.footpage-copyright {
        margin: 2em;
    }

    div.footpage-copyright {
        text-align: center;
        font-size: 0.9em;
        color: #222;
        padding: 2em;
    }

</style>