import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';


import "./styles/responsive/normalize.css";
import "./styles/responsive/starter.css";
import "./styles/responsive/colors.css";
import "./styles/responsive/custom.css";
import 'vue-material-design-icons/styles.css';
import "./styles/base.css";

import store from "./store";
import Application from './components/Application.vue';
import HomePage from "./components/pages/HomePage.vue";
import ExamplePage from "./components/pages/DemoPage.vue";
import MapEditPage from "./components/pages/MapEditPage.vue";
import FeatPage from "./components/pages/FeatPage.vue";
import TechPage from "./components/pages/TechPage.vue";
import AboutPage from "./components/pages/AboutPage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import CreateUserPage from "./components/pages/CreateUserPage.vue";
import UserRegistered from "./components/UserRegistered.vue";

Vue.use(Vuex);
Vue.use(VueRouter);



function createApplication() {

    const routes = [
        {
            path: '/',
            name: 'home',
            components: {
                default: HomePage
            }
        },
        {
            path: '/tech',
            components: {
                default: TechPage
            }
        },
        {
            path: '/demos',
            components: {
                default: ExamplePage
            }
        },
        {
            path: '/features',
            components: {
                default: FeatPage
            }
        },
        {
            path: '/mapedit',
            components: {
                default: MapEditPage
            }
        },
        {
            path: '/about',
            components: {
                default: AboutPage
            }
        },
        {
            path: '/login',
            components: {
                default: LoginPage
            }
        },
        {
            path: '/createuser/success',
            components: {
                default: UserRegistered
            }
        },
        {
            path: '/createuser',
            components: {
                default: CreateUserPage
            }
        },
    ];

    return new Vue({
        el: '#vue-application',
        router: new VueRouter({routes}),
        store: new Vuex.Store(store),
        components: {
            Application
        },

        render: function (h) {
            return h(Application);
        }
    });
}

window.APPLICATION = createApplication();
