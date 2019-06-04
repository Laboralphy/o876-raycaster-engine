import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';


import "./styles/responsive/normalize.css";
import "./styles/responsive/starter.css";
import "./styles/responsive/colors.css";
import "./styles/responsive/custom.css";
import 'vue-material-design-icons/styles.css';

import Application from './components/Application.vue';
import HomePage from "./components/HomePage.vue";
import ExamplePage from "./components/ExamplePage.vue";
import MapEditPage from "./components/MapEditPage.vue";

Vue.use(Vuex);
Vue.use(VueRouter);

function createApplication() {

    const routes = [
        {
            path: '/',
            components: {
                default: HomePage
            }
        },
        {
            path: '/examples',
            components: {
                default: ExamplePage
            }
        },
        {
            path: '/mapedit',
            components: {
                default: MapEditPage
            }
        }
    ];

    return new Vue({
        el: '#vue-application',
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
