<template>
    <div
            ref="pasteCatcher"
            contenteditable="true"
            class="paste-function"
    ></div>
</template>

<script>

    // trick to makje contentEditable works with vue.js (and v-model)
    // @input="event => $emit('update:content', event.target.innerText)"

    export default {
        name: "ImagePasteBin",

        data: function() {
            return {
                bCtrlPressed: false,
                bCommandPressed: false,
                bPasteEventTriggered: false
            };
        },

        methods: {
            keyDownAction: function(event) {
                const oPasteCatcher = this.$refs.pasteCatcher;
                const key = event.key;
                //ctrl
                if (key === 'Control' || event.metaKey || event.ctrlKey) {
                    if (!this.bCtrlPressed) {
                        this.bCtrlPressed = true;
                    }
                }
                //v
                if (key === 'v') {
                    const ae = document.activeElement;
                    if (!!ae && ae.type === 'text') {
                        //let user paste into some input
                        return false;
                    }

                    if (this.bCtrlPressed){
                        oPasteCatcher.focus();
                    }
                }
            },

            keyUpAction: function (event) {
                //ctrl
                if (!event.ctrlKey && this.bCtrlPressed) {
                    this.bCtrlPressed = false;
                } else if (!event.metaKey && this.bCommandPressed){
                    this.bCommandPressed = false;
                    this.bCtrlPressed = false;
                }
            },

            pasteImage: function(sSrc) {
                const oImage = new Image();
                oImage.addEventListener('load', oEvent => this.$emit('imagepaste', oImage));
                oImage.src = sSrc;
                this.clearPasteCatcher();
            },

            pasteEvent: function(event) {
                this.bPasteEventTriggered = false;
                const items = (event.clipboardData || event.originalEvent.clipboardData).items;
                let item, blob, reader,
                    oURL = window.URL || window.webkitURL,
                    sSource;
                if (items) {
                    this.bPasteEventTriggered = true;
                }
                for (let index = 0, l = items.length; index < l; ++index) {
                    item = items[index];
                    if (item.kind === 'file' && item.type.indexOf('image') >= 0) {
                        blob = item.getAsFile();
                        reader = new FileReader();
                        reader.addEventListener('load', (function(event){
                            this.pasteImage(event.target.result);
                        }).bind(this)); // data url!
                        reader.readAsDataURL(blob);
                    }
                }
            },


            handleMutations: function(mutations) {
                mutations.forEach(mutation => {
                    if (this.bPasteEventTriggered || !this.bCtrlPressed || mutation.type !== 'childList'){
                        // we already got data in paste_auto()
                        return true;
                    }
                    // if paste handle failed - capture pasted object manually
                    if (mutation.addedNodes.length === 1) {
                        if (mutation.addedNodes[0].src !== undefined) {
                            //image
                            this.pasteImage(mutation.addedNodes[0].src);
                        }
                    }
                });
            },

            /**
             * supprime ce qui vien d'être collé par le Ctrl-V, on n'en a plus besoin arpès avoir intercepté le contenu src
             */
            clearPasteCatcher: function() {
                this.$nextTick(() => {
                    this.$refs.pasteCatcher.innerHTML = '';
                });
            }
        },

        mounted: function() {
            document.addEventListener('keydown', this.keyDownAction, false); //firefox fix
            document.addEventListener('keyup', this.keyUpAction, false); //firefox fix
            document.addEventListener('paste', this.pasteEvent, false); //official paste handler

            const observer = new MutationObserver(this.handleMutations);
            const config = {
                attributes: true,
                childList: true,
                characterData: true
            };
            observer.observe(this.$refs.pasteCatcher, config);

        },

        beforeDestroy: function() {
            document.removeEventListener('keydown', this.keyDownAction);
            document.removeEventListener('keyup', this.keyUpAction);
            document.removeEventListener('paste', this.pasteEvent);
        }

    }
</script>

<style scoped>
    .paste-function {
        opacity: 0;
        position: fixed;
        top: 0;
        left: 0;
        max-width: 10px;
        width: 10px;
        overflow: hidden;
        margin-left: -20px;
    }
</style>