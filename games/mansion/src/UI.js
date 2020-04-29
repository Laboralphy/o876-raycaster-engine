import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import * as UI_MUTATIONS from './store/modules/ui/mutation-types';
import * as UI_ACTIONS from './store/modules/ui/action-types';
import Application from './components/Application.vue';
import STRINGS from '../assets/strings';
import StoreAbstract from "./StoreAbstract";

Vue.use(Vuex);

class UI extends StoreAbstract {
    constructor(sDomSelector) {
        super('ui');
        this._vue = this.createApplication(sDomSelector);
        this.store = this._vue.$store;
    }

    createApplication(sWhere) {
        return new Vue({
            el: sWhere,
            store: new Vuex.Store(store),
            components: {
                Application
            },
            render: function (h) {
                return h(Application);
            }
        });
    }

    /**
     * Displays a popup with a text inside, and an icon
     * @param sText
     * @param sIconRef
     * @param params
     * @return {Promise<any>}
     */
    popup(sText, sIconRef, ...params) {
        const icon = !!sIconRef && sIconRef.length > 0 ? 'assets/icons/i-' + sIconRef + '.png' : '';
        let text = sText in STRINGS ? STRINGS[sText] : sText;
        for (let i = 0, l = params.length; i < l; ++i) {
            const p = params[i];
            let sParamText = p in STRINGS ? STRINGS[p] : p;
            text = text.replace(/\%s/, sParamText);
        }
        return this.dispatch(UI_ACTIONS.SHOW_POPUP, {text, icon});
    }

    show() {
        this.dispatch(UI_ACTIONS.SHOW_UI_FRAME, {});
    }

    hide() {
        this.dispatch(UI_ACTIONS.HIDE_UI_FRAME, {});
    }

    storePhoto(content, type, value) {
        this.commit(UI_MUTATIONS.STORE_PHOTO, {content, type, value});
    }
}

export default UI;
