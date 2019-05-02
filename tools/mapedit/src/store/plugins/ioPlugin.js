import * as EDITOR_ACTION from '../modules/editor/action-types';
import * as EDITOR_MUTATION from '../modules/editor/mutation-types';
import * as LEVEL_ACTION from '../modules/level/action-types';
import * as LEVEL_MUTATION from '../modules/level/mutation-types';
import * as CONSTS from '../../consts';

export default store => {


    const fetchJSON = async function(url, postData = null) {
        const bPost = !!postData;
        const oRequest = {
            method: bPost ? 'POST' : 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };
        if (bPost) {
            oRequest.body = JSON.stringify(postData);
        }
        const response = await fetch(url, oRequest);
        const oResponse = await response.json();
        if (response.status === 500) {
            throw new Error('Error 500 : internal server error : ' + oResponse.message);
        }
        return oResponse;
    };


    const saveLevel = function(name, data) {
        return fetchJSON(CONSTS.SERVICE_URL_SAVE, {
            name,
            data
        });
    };

    const loadLevel = async function(name) {
        return fetchJSON(CONSTS.SERVICE_URL_LOAD + '&name=' + name);
    };

    const getLevelList = async function() {
        return fetchJSON(CONSTS.SERVICE_URL_LIST);
    };

    store.subscribeAction(async (action, state) => {
        try {
            const payload = action.payload;

            switch (action.type) {
                case 'editor/' + EDITOR_ACTION.LIST_LEVELS:
                    store.commit('editor/' + EDITOR_MUTATION.SET_LEVEL_LIST, {list: await getLevelList()});
                    break;

                case 'level/' + LEVEL_ACTION.SAVE_LEVEL:
                    saveLevel(payload.name, state.level);
                    break;

                case 'level/' + LEVEL_ACTION.LOAD_LEVEL: {
                    store.commit('level/' + LEVEL_MUTATION.SET_STATE_CONTENT, {content: await loadLevel(payload.name)});
                }
                break;
            }
        } catch (e) {
            console.error(e);
        }
    });
};
