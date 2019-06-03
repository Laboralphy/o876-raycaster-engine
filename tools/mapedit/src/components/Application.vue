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
                <StatusBar>
                    <FlashyText></FlashyText>
                </StatusBar>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MainMenu from "./MainMenu.vue";
    import StatusBar from "./StatusBar.vue";
    import FlashyText from "./FlashyText.vue";

    export default {
        name: "Application",
        components: {FlashyText, StatusBar, MainMenu, MyButton, Window},
        data: function() {
            return {
                popup: {
                    visible: false,
                    title: '',
                    content: ''
                }
            };
        }
    }
</script>

<style scoped>
    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 240px;
        }
    }

    /* Small devices (portrait tablets and large phones, 600px and up) */
    @media only screen and (min-width: 600px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 280px;
        }
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 320px;
        }
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 360px;
        }
    }

    /* Extra large devices (large laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1200px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 420px;
        }
    }

</style>