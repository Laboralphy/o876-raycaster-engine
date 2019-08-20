import ui from './ui';
import * as MUTATIONS from './ui/store/mutation-types';

class PopupManager {

    constructor() {
        this._list = [];
        this._time = 0;
        this._hidden = true;
        this._current = {text: null, icon: null};
        this.TIME_GRANULARITY = 200;
    }

    worth(text, icon) {
        const isAlreadyInList = this._list.some(p => p.text === text && p.icon === icon);
        const isAlreadyDisplayed = !this._hidden && this._current.text === text && this._current.icon === icon;
        return !isAlreadyInList && !isAlreadyDisplayed;
    }

    /**
     * displays a new popup
     * @param text {string} popup message
     * @param icon {string} icon url
     * @param time {number} popup duration
     */
    popup(text, icon, time) {
        if (!this.worth(text, icon)) {
            return;
        }
        if (this.isMore() || !this._hidden) {
            // another popup is being display
            this._list.push({text, icon, time});
        } else {
            // show popup immediatly, but both the old and the new popup content must differ
            this.show(text, icon, time);
        }
    }

    /**
     * Immediatly sets popup text, icon. Resets popup display time
     * @param text {string}
     * @param icon {string}
     * @param time {number}
     */
    show(text, icon, time) {
        ui.mutate(MUTATIONS.SHOW_POPUP, {text, icon});
        this._current.text = text;
        this._current.icon = icon;
        this._time = time;
        this._hidden = false;
    }

    /**
     * show the next popup in line. resets time value.
     */
    showNext() {
        const {text, icon, time} = this._list.shift();
        this.show(text, icon, time);
    }

    /**
     * if true, there are more popup to show
     * @return {boolean}
     */
    isMore() {
        return this._list.length > 0;
    }

    /**
     * if true, the it's time to hide popup
     * @return {boolean}
     */
    timeOut() {
        return this._time <= 0;
    }

    process() {
        // always decrease time, until zero
        if (!this.timeOut()) {
            this._time -= this.TIME_GRANULARITY;
        }
        if (this._hidden && this.isMore()) {
            // popup is hidden and there is more popup to show
            this.showNext();
        }
        if (!this._hidden && this.timeOut()) {
            // popup is visible, but the time is out
            ui.mutate(MUTATIONS.HIDE_POPUP);
            this._hidden = true;
        }
    }
}

export default PopupManager;