import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import * as ALBUM_MUTATIONS from './store/modules/album/mutation-types';
import Application from './components/Application.vue';
import STRINGS from '../assets/strings';
import StoreAbstract from "./StoreAbstract";

Vue.use(Vuex);

class Album extends StoreAbstract {

    constructor(store) {
        super('album');
        this.store = store;
    }

    storePhoto(content, type, value, ref) {
        this.commit(ALBUM_MUTATIONS.STORE_PHOTO, {content, type, value, ref});
    }

}

export default Album;