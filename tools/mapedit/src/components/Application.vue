<template>
    <table class="o876structure">
        <tbody>
            <tr>
                <td colspan="2">
                    <MainMenu></MainMenu>
                </td>
            </tr>
            <tr class="floatingHeight">
                <td class="floatingWidth">
                    <div>
                        <router-view></router-view>
                    </div>
                </td>
                <td class="side-panel">
                    <div>
                        <router-view name="side"></router-view>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <StatusBar>bon...</StatusBar>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import Window from "./Window.vue";
    import StatusBar from "./StatusBar.vue";
    import MyButton from "./MyButton.vue";
    import MainMenu from "./MainMenu.vue";

    export default {
        name: "Application",
        components: {MainMenu, MyButton, StatusBar, Window},
    }
</script>

<style scoped>
    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 128px;
        }
    }

    /* Small devices (portrait tablets and large phones, 600px and up) */
    @media only screen and (min-width: 600px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 192px;
        }
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 224px;
        }
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 280px;
        }
    }

    /* Extra large devices (large laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1200px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 360px;
        }
    }
</style>