<template>
    <table class="o876structure">
        <tbody>
            <tr class="floatingHeight">
                <td class="floatingWidth">
                    <div>
                        <Window
                            caption="Super window 1"
                            :commands="mainWindowCommands"
                            @command="clickouille"
                        >Youpi</Window>
                    </div>
                </td>
                <td class="side-panel">
                    <div>
                        <Window
                            caption="Browser"
                        >Super</Window>
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
    export default {
        name: "Application",
        components: {StatusBar, Window},

        data: function() {
            return {
                statusBarHeight: 32,
                mainWindowCommands: [
                    {
                        caption: 'Click1',
                        id: 'k1'
                    },
                    {
                        caption: 'Click2',
                        id: 'k2'
                    }
                ]
            }
        },

        methods: {
            clickouille: function({id}) {
                console.log('click sur', id);
            }
        }
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
            width: 256px;
        }
    }

    /* Extra large devices (large laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1200px) {
        table.o876structure > tbody > tr > td.side-panel {
            width: 320px;
        }
    }
</style>