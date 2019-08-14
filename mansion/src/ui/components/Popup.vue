<template>
    <div :class="getComputedClass">
        <table>
            <tr>
                <td>
                    <div class="icon"><img class="icon" v-if="icon !== ''" alt="missing popup icon" :src="icon" /></div>
                </td>
                <td>
                    <p class="message">{{ text }}</p>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

    export default {
        name: "Popup",
        props: {
            icon: {
                type: String,
                required: false,
                default: ''
            },
            text: {
                type: String,
                required: true
            },
            visible: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        computed: {
            getComputedClass: function() {
                const a = ['popup'];
                a.push(this.visible ? 'visible' : 'hidden');
                return a.join(' ');
            }
        }
    }
</script>

<style scoped>

    div.popup {
        position: absolute;
        box-sizing: border-box;
        top: 15%;
        left: 25%;
        width: 50%;
        background-color: rgb(181, 151, 91);
        border: solid 0.2em rgb(37, 26, 26);
        border-radius: 0.5em;
        padding: 0;
        visibility: hidden;
        opacity: 0;
        transform: translateY(-1em);
        transition: transform 0.25s, visibility 0.25s, opacity 0.25s ease-in;
        vertical-align: middle;
    }

    div.popup div.icon {
        width: 3em;
        padding: 0;
    }

    div.popup div.icon img.icon {
        margin: auto;
        width: 2em;
        height: 2em;
        image-rendering: initial;
    }

    div.popup p.message {
        font-size: 1em;
        font-family: "Courier New", Courier, monospace;
        color: rgb(37, 26, 26);
        text-shadow: rgba(0, 0, 0, 0.5) 0.1em 0.1em 0.15em;
    }

    div.popup.visible {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
        transition: transform 0.25s, visibility 0s, opacity 0.25s ease-out;
    }

    div.popup.hidden {
        visibility: hidden;
        opacity: 0;
        transform: translateY(-1em);
        transition: transform 0.25s, visibility 0.25s, opacity 0.25s ease-in;
    }

</style>