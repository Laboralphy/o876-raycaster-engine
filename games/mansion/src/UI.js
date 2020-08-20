import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import * as UI_MUTATIONS from './store/modules/ui/mutation-types';
import * as UI_ACTIONS from './store/modules/ui/action-types';
import Application from './components/Application.vue';
import STRINGS from '../assets/strings';
import StoreAbstract from "./StoreAbstract";
import ObjectExtender from 'libs/object-helper/Extender';

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
        const icon = !!sIconRef && sIconRef.length > 0 ? 'assets/icons/' + sIconRef + '.png' : '';
        let text = sText in STRINGS ? STRINGS[sText] : sText;
        for (let i = 0, l = params.length; i < l; ++i) {
            const p = params[i];
            switch (typeof p) {
                case 'string':
                    let sParamText = ObjectExtender.objectGet(STRINGS, p);
                    text = text.replace(/%s/, sParamText);
                    break;

                case 'number':
                    text = text.replace(/%d/, p);
                    break;
            }
        }
        return this.dispatch(UI_ACTIONS.SHOW_POPUP, {text, icon});
    }

    show() {
        this.dispatch(UI_ACTIONS.SHOW_UI_FRAME, {});
    }

    hide() {
        this.dispatch(UI_ACTIONS.HIDE_UI_FRAME, {});
    }

    displayPhotoDetailScore({
        value,
        energy,
        distance,
        angle,
        targets,
        shutter,
        damage
    }) {
        this.dispatch(UI_ACTIONS.SET_SHOT, {
            value,
            energy,
            distance,
            angle,
            targets,
            shutter,
            damage
        });
    }

    displayPhotoScore(nValue) {
        this.dispatch(UI_ACTIONS.SET_SHOT, {
            value: nValue,
            energy: 0,
            distance: Infinity,
            angle: Infinity,
            targets: 0,
            shutter: false
        });
    }
}

export default UI;
