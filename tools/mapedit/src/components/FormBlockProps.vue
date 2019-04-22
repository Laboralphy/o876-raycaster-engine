<template>
    <form>
        <div>
            <label>Phys:
                <select v-model="mPhys">
                    <option value="0">Walkable</option>
                    <option value="1">Solid block</option>
                    <option value="2">Door up</option>
                    <option value="3">Curtain up</option>
                    <option value="4">Door down</option>
                    <option value="5">Curtain down</option>
                    <option value="6">Door left</option>
                    <option value="7">Curtain left</option>
                    <option value="8">Door right</option>
                    <option value="9">Curtain right</option>
                    <option value="10">Door slide double</option>
                    <option value="11">Secret block</option>
                    <option value="12">Transparent block</option>
                    <option value="13">Invisible block</option>
                    <option value="14">Offset block</option>
                </select>
            </label>
        </div>
        <div>
            <label>Offs: <input v-model="mOffset" type="number" min="0" :max="getTileWidth"/></label>
        </div>
        <div>
            <label>Anim: <input v-model="mAnim" type="checkbox"/></label>
        </div>
        <div>
            <fieldset v-show="mAnim">
                <legend>Animation properties</legend>
                <div>
                    <label>Count: <input v-model="mAnimCount" type="number" min="1"/></label>
                </div>
                <div>
                    <label>Duration: <input v-model="mAnimDuration" type="number" min="0" step="20"/></label>
                </div>
                <div>
                    <label>
                        Loop:
                        <select v-model="mAnimLoop">
                            <option value="0">None</option>
                            <option value="1">Forward</option>
                            <option value="2">Yoyo</option>
                        </select>
                    </label>
                </div>
            </fieldset>
        </div>
        <hr/>
        <div>
            <MyButton>Construire</MyButton>
        </div>
    </form>
</template>

<script>
    import MyButton from "./MyButton.vue";

    export default {
        name: "FormBlockProps",
        components: {MyButton},

        data: function() {
            return {
                mPhys: 0,
                mOffset: 0,
                mAnim: false
            }
        }
    }
</script>

<style scoped>

</style>