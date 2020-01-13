<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>The map editor</h3>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <p>The Map Editor is a web software that allows you to design your own maps for a Raycaster Game Project.</p>
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
    export default {
        name: "MapEditPage",

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