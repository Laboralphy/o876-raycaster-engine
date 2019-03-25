import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from './store';

import Application from './components/Application.vue';

import './styles/base.css';
import './styles/o876structure/o876structure.css';


Vue.use(Vuex);

function createApplication() {

    const routes = [
       // {path: "/", component: Splash},
       // {path: "/workspace", component: Workspace},
    ];

    console.log('OK');

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