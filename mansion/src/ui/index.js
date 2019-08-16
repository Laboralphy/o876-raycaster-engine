import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import * as MUTATIONS from './store/mutation-types';
import * as ACTIONS from './store/action-types';
import Application from './components/Application.vue';

Vue.use(Vuex);


class UI {
    constructor() {
        this._vue = this.createApplication();
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

    dispatch(action, payload) {
        return this._vue.$store.dispatch(action, payload);
    }

    mutate(mutation, payload) {
        this._vue.$store.commit(mutation, payload);
    }

    popup(text, icon = '') {
        this.dispatch(ACTIONS.SHOW_POPUP, {text, icon});
    }
}

export default UI;
