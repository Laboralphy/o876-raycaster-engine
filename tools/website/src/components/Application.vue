<template>
    <div class="pad">
        <div class="container">
            <Card color="blue" title="O876 Raycaster Game Engine">
                <nav>
                    <ul>
                        <li><button @click="$router.push('/')">Home</button></li>
                        <li><button @click="$router.push('/features')">Features</button></li>
                        <li><button @click="$router.push('/examples')">Examples</button></li>
                        <li><button @click="$router.push('/mapedit')">Map editor</button></li>
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
    export default {
        name: "Application",
        components: {HomeIcon, Card}
    }
</script>

<style scoped>
    div.pad {
        padding: 0.85em;
    }
</style>