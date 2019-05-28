<template>
    <figure
            :class="getComputedClass"
            @click="$emit('click')"
    >
        <img
                :src="getSource"
        />
        <figcaption><span class="filename">{{ name }}</span> - <span class="datestring">{{ getDateString }}</span></figcaption>
    </figure>
</template>

<script>
    export default {
        name: "LevelThumbnail",

        props: {
            name: {
                type: String,
                required: true
            },
            preview: {
                required: false,
                default: false
            },
            date: {
                required: false,
                default: false
            },
            selected: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        computed: {
            getComputedClass: function() {
                const a = ['level-thumbnail'];
                if (this.selected) {
                    a.push('selected');
                }
                return a.join(' ');
            },

            getDateString: function() {
                const d = new Date(parseInt(this.date.toString() + '000'));
                //2019-05-28T16:35:04.231Z
                const d2 = d.toJSON();
                const r = d2.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2})T([0-9]{2}:[0-9]{2})/);
                return r[1] + ' ' + r[2];
            },

            getSource: function() {
                return !!this.preview ? this.preview : './assets/images/no-preview.png';
            }
        },
    }
</script>

<style scoped>
    figure.level-thumbnail {
        display: inline-block;
        border: outset #AAA 0.2em;
        border-radius: 0.3em;
        padding: 0.4em;
        background-color: #AAA;
        margin: 1.5em;
        cursor: pointer;
    }

    figure.level-thumbnail img {
        border: solid thin #000;
    }

    figure.level-thumbnail figcaption span.filename {
    }

    figure.level-thumbnail:hover {
        filter: brightness(140%);
    }

    figure.level-thumbnail.selected {
        border-color: lime;
        filter: brightness(120%);
    }

    figure.level-thumbnail.selected:hover {
        border-color: #8F8;
        filter: brightness(140%);
    }

    figure.level-thumbnail figcaption span.datestring {
        font-style: italic;
        font-size: 0.8em;
        color: #333;
    }

</style>