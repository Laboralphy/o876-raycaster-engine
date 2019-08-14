import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import Application from './components/Application.vue';

import './styles/font-sizes.css';
import 'vue-material-design-icons/styles.css';

Vue.use(Vuex);

function createApplication() {
    return new Vue({
        el: 'div.overlay',
        store: new Vuex.Store(store),
        components: {
            Application
        },
        render: function (h) {
            return h(Application);
        }
    });
}

let oApplication = null;

export default {
    get instance() {
        if (!oApplication) {
            oApplication = createApplication();
            window.VUEAPP = oApplication;
        }
        return oApplication;
    },
    mutate: function(mutation, payload) { this.instance.$store.commit(mutation, payload); }
};
