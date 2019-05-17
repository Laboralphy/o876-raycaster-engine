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

            onFileInputChange: async function(oEvent) {
                const oFiles = oEvent.target.files; // FileList object
                const aProms = [];
                // Loop through the FileList and render image files as thumbnails.
                for (let i = 0, l = oFiles.length; i < l; ++i) {
                    const f = oFiles[i];
                    const p = new Promise(resolve => {
                        // Only process image files.
                        const oReader = new FileReader();
                        oReader.addEventListener('load', oILEvent => resolve({data: oILEvent.target.result}));
                        oReader.readAsDataURL(f);
                    });
                    aProms.push(p);
                }
                const aResult = await Promise.all(aProms);
                aResult.forEach(r => this.$emit('load', r));
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