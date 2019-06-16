<template>
    <figure
            :class="getComputedClass"
    >
        <img :alt="name + ' preview'" :src="getSource" />
        <figcaption>
            <div>
                <span class="filename">{{ name }}</span> - <span class="datestring">{{ getDateString }}</span>
            </div>
            <div v-if="exported">
                <a href="#" @click="unpublish(name)">Unpublish</a>
            </div>
        </figcaption>
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
            exported: {
                required: false,
                default: false
            }
        },

        computed: {

            getComputedClass: function() {
                const a = ['level-thumbnail'];
                if (!this.exported) {
                    a.push('not-exported');
                }
                return a.join(' ');
            },

            getDateString: function() {
                //const d = new Date(parseInt(this.date.toString() + '000'));
                const d = new Date(this.date);
                console.log(d);
                //2019-05-28T16:35:04.231Z
                const d2 = d.toJSON();
                const r = d2.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2})T([0-9]{2}:[0-9]{2})/);
                return r[1] + ' ' + r[2];
            },

            getSource: function() {
                return !!this.preview ? this.preview : './assets/images/no-preview.png';
            }
        },

        methods: {
            unpublish: function(name) {
                this.$emit('unpublish', {name});
            }
        }
    }
</script>

<style scoped>
    figure.level-thumbnail {
        display: inline-block;
        border: outset #999 0.2em;
        border-radius: 0.3em;
        padding: 0.4em;
        background-color: #999;
        margin: 1.5em;
    }

    figure.level-thumbnail img {
        border: solid thin #000;
        margin: 0;
    }

    figure.level-thumbnail.not-exported {
        filter: grayscale(100%);
        opacity: 0.666;
    }

    figure.level-thumbnail figcaption span.filename {
    }

    figure.level-thumbnail figcaption span.datestring {
        font-style: italic;
        font-size: 0.8em;
        color: #333;
    }

</style>