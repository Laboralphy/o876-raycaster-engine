import * as TYPES from './mutation-types';
export default {

    [TYPES.SHIFT_POPUP]: function(state) {
        if (state.popup.queue.length > 0) {
            const {text, icon, time} = state.popup.queue.shift();
            state.popup.text = text;
            state.popup.icon = icon;
            state.popup.time = time;
            state.popup.visible = true;
        }
    },

    [TYPES.HIDE_POPUP]: function(state) {
        state.popup.visible = false;
    },

    [TYPES.SHOW_POPUP]: function(state) {
        state.popup.visible = true;
    },

    [TYPES.PUSH_POPUP]: function(state, {text, icon}) {
        const aWords = text.split(' ').filter(w => w.length > 1); // splits text into words
        const nWordCount = aWords.length; // number of words in the text
        const WPM = 180; // word read per minutes
        const MINIMUM_TIME = 1500; // minimum read time for a text
        const MS_IN_A_MINUTE = 60000; // number of milliseconds in a minute
        const time = Math.ceil(Math.max(MINIMUM_TIME, MS_IN_A_MINUTE * nWordCount / WPM));
        state.popup.queue.push({text, icon, time});
    },

    [TYPES.SET_HUD_VISIBLE]: function(state, {value}) {
        state.hud.visible = value;
    },

    [TYPES.SET_UI_FRAME_VISIBLE]: function(state, {value}) {
        state.uiframe.visible = value;
    },

    [TYPES.SET_SHOT]: function(state, {
        value, energy, distance, angle, targets, shutter, damage
    }) {
        state.shot.visible = true;
        state.shot.shutter = shutter;
        state.shot.energy = energy;
        state.shot.distance = distance;
        state.shot.angle = angle;
        state.shot.targets = targets;
        state.shot.value = value;
        state.shot.damage = damage;
    },


    [TYPES.CLEAR_SHOT]: function(state) {
        state.shot.visible = false;
    },

    [TYPES.SET_UI_FULLY_VISIBLE]: function(state, {value}) {
        state.uiframe.fullyVisible = value;
    },

    [TYPES.SET_ALBUM_ACTIVE_TYPE]: function(state, {value}) {
        state.album.activeType = value;
    },

    [TYPES.SET_MAIN_ACTIVE_TAB]: function(state, {value}) {
        state.uiframe.activeTab = value;
    },

    [TYPES.SET_ITEM_TYPE_ACTIVE_TYPE]: function(state, {value}) {
        state.uiframe.activeInventoryTab = value;
    },

    [TYPES.SET_PHOTO_DETAILS]: function(state, {visible, title = '', content = '', description = '', value = 0}) {
        const p = state.photodetails;
        p.visible = visible;
        p.title = title;
        p.content = content;
        p.description.splice(0, p.description.length, ...description);
        p.value = value;
    },

    [TYPES.SHOW_FIRST_PAGE]: function(state, {value}) {
        state.mainmenu.visible = value;
    },

    [TYPES.SET_MAIN_MENU_PHASE]: function(state, {value}) {
        state.mainmenu.phase = value;
    }
}