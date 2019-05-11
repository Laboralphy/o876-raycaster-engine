<template>
    <div>
        <input
                ref="image"
                type="file"
                @change="onFileInputChange"
                accept="image/png, image/jpeg, image/gif"
                :multiple="multiple"
        />
        <MyButton
                title="title"
                @click="onClick"
        ><slot></slot></MyButton>
    </div>
</template>

<script>
    import MyButton from "./MyButton.vue";
    export default {
        name: "ImageLoader",
        components: {MyButton},
        props: {
            title: String,
            multiple: {
                type: Boolean,
                default: false,
                required: false
            }
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
                    const oReader = new FileReader();
                    oReader.addEventListener('load', oILEvent => this.$emit('load', {data: oILEvent.target.result}));
                    oReader.readAsDataURL(f);
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