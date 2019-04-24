import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from './store';

import Application from './components/Application.vue';

import './styles/base.css';
import './styles/o876structure/o876structure.css';
import 'vue-material-design-icons/styles.css';

import LevelGrid from "./components/LevelGrid.vue";
import MainSide from "./components/MainSide.vue";

Vue.use(Vuex);
Vue.use(VueRouter);

function createApplication() {

    const routes = [
        {
            path: "/",
            components: {
                default: LevelGrid,
                side: MainSide
            }
        },
    ];

    return new Vue({
        el: '#vue-application',
        store: new Vuex.Store(store),
        router: new VueRouter({routes}),
        components: {
            Application
        },

        render: function (h) {
            return h(Application);
        }
    });
}

window.APPLICATION = createApplication();