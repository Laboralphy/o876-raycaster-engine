<template>
    <div>
        <input
                ref="image"
                type="file"
                @change="onFileInputChange"
        />
        <button
                type="button"
                :title="hint"
                @click="onClick"
        ><slot></slot></button>
    </div>
</template>

<script>
    export default {
        name: "ImageLoader",

        props: {
            hint: String
        },

        data: function() {
            return {
                filename: ''
            }
        },

        methods: {
            onClick: function(oEvent) {
                this.$refs.image.value = '';
                this.$refs.image.click();
            },

            onFileInputChange: function(oEvent) {
                const oFiles = oEvent.target.files; // FileList object
                // Loop through the FileList and render image files as thumbnails.
                for (let i = 0, l = oFiles.length; i < l; ++i) {
                    const f = oFiles[i];
                    // Only process image files.
                    if (f.type.match('image.*')) {
                        const oReader = new FileReader();
                        oReader.onload = oILEvent => this.$emit('load', {data: oILEvent.target.result});
                        oReader.readAsDataURL(f);
                    }
                }
            }
        }
    }
</script>

<style scoped>
    div {
        display: inline;
    }

    input[type="file"] {
        visibility: hidden;
        position: absolute;
        top: -50px;
        left: -50px
    }
</style>