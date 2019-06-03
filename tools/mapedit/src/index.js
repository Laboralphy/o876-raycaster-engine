import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from './store';

import Application from './components/Application.vue';

import './styles/base.css';
import './styles/o876structure/o876structure.css';
import 'vue-material-design-icons/styles.css';

import LevelGrid from "./components/LevelGrid.vue";
import TileLoader from "./components/TileLoader.vue";
import TileBrowser from "./components/TileBrowser.vue";
import TagManager from "./components/TagManager.vue";
import AnimationBuilder from "./components/AnimationBuilder.vue";
import BlockBuilder from "./components/BlockBuilder.vue";
import BlockBrowser from "./components/BlockBrowser.vue";
import LevelList from "./components/LevelList.vue";
import MainSplash from "./components/MainSplash.vue";
import MainSide from "./components/MainSide.vue";
import MarkerManager from "./components/MarkerManager.vue";
import ThingBrowser from "./components/ThingBrowser.vue";
import ThingBuilder from "./components/ThingBuilder.vue";
import ThingView from "./components/ThingView.vue";
import AmbianceSetup from "./components/AmbianceSetup.vue";
import RenderView from "./components/RenderView.vue";
import RenderSide from "./components/RenderSide.vue";
import Settings from "./components/Settings.vue";

Vue.use(Vuex);
Vue.use(VueRouter);

function createApplication() {

    const routes = [
        {
            path: "/",
            components: {
                default: MainSplash,
                side: MainSide
            }
        },
        {
            path: "/level/blocks",
            components: {
                default: LevelGrid,
                side: BlockBrowser
            }
        },
        {
            path: "/level/things",
            components: {
                default: LevelGrid,
                side: ThingBrowser
            }
        },
        {
            path: "/level/tags",
            components: {
                default: LevelGrid,
                side: TagManager
            }
        },
        {
            path: "/level/marks",
            components: {
                default: LevelGrid,
                side: MarkerManager
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
            path: "/build-anim",
            components: {
                default: AnimationBuilder,
                side: TileBrowser
            }
        },
        {
            path: "/build-block/:id",
            components: {
                default: BlockBuilder,
                side: TileBrowser
            },
            params: {
                id: Number
            },
            props: {default: true, side: false}
        },
        {
            path: "/build-thing/:id",
            components: {
                default: ThingBuilder,
                side: TileBrowser
            },
            params: {
                id: Number
            },
            props: {
                default: true,
                side: false
            }
        },
        {
            path: "/view-thing",
            components: {
                default: LevelGrid,
                side: ThingView
            }
        },
        {
            path: "/list-levels",
            components: {
                default: LevelList,
                side: BlockBrowser
            }
        },
        {
            path: "/setup-ambiance",
            components: {
                default: AmbianceSetup,
                side: MainSide
            }
        },
        {
            path: "/render",
            components: {
                default: RenderView,
                side: RenderSide
            }
        },
        {
            path: "/settings",
            components: {
                default: Settings,
                side: MainSide
            }
        }
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
