import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from './store';

import Application from './components/Application.vue';

import './styles/base.css';
import './styles/o876structure/o876structure.css';
import 'vue-material-design-icons/styles.css';

import LevelGrid from "./components/LevelGrid.vue";
import TileBrowser from "./components/TileBrowser.vue";
import TileLoader from "./components/TileLoader.vue";
import ConfigPad from "./components/ConfigPad.vue";
import BlockBuilder from "./components/BlockBuilder.vue";

Vue.use(Vuex);
Vue.use(VueRouter);

function createApplication() {

    const routes = [
        {
            path: "/",
            components: {
                default: LevelGrid,
                side: TileBrowser
            }
        },
        {
            path: "/load-tiles",
            components: {
                default: TileLoader,
                side: TileBrowser
            }
        },
        {
            path: "/build-blocks",
            components: {
                default: BlockBuilder,
                side: TileBrowser
            }
        },
        {
            path: "/config",
            components: {
                default: ConfigPad,
                side: TileBrowser
            }
        },

        // {path: "/workspace", component: Workspace},
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