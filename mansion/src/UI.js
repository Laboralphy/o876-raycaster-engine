import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import * as UI_MUTATIONS from './store/modules/ui/mutation-types';
import * as UI_ACTIONS from './store/modules/ui/action-types';
import Application from './components/Application.vue';

Vue.use(Vuex);

class UI {
    constructor() {
        this._vue = this.createApplication();
    }

    get store() {
        return this._vue.$store;
    }

    createApplication() {
        return new Vue({
            el: '#vue-application',
            store: new Vuex.Store(store),
            components: {
                Application
            },
            render: function (h) {
                return h(Application);
            }
        });
    }

    popup(text, icon = '') {
        this._vue.$store.dispatch('ui/' + UI_ACTIONS.SHOW_POPUP, {text, icon});
    }
}

export default UI;
