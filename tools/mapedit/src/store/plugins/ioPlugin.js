import * as EDITOR_ACTION from '../modules/editor/action-types';
import * as LEVEL_ACTION from '../modules/level/action-types';
import * as MUTATION from '../modules/level/mutation-types';
import * as CONSTS from '../../consts';

export default store => {


        const saveLevel = async function(name, data) {
        const rawResponse = await fetch(CONSTS.SERVICE_URL_SAVE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                data
            })
        });
        return await rawResponse.json();
    };

    const loadLevel = async function(name) {
        const rawResponse = await fetch(CONSTS.SERVICE_URL_LOAD + '&name=' + name, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        return await rawResponse.json();
    };

    const getLevelList = async function() {
        const rawResponse = await fetch(CONSTS.SERVICE_URL_LIST, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        return await rawResponse.json();
    };

    store.subscribeAction(async (action, state) => {
        const payload = action.payload;

        switch (action.type) {
            case 'editor/' + EDITOR_ACTION.LIST_LEVELS:
                console.log(await getLevelList());
                break;

            case 'level/' + LEVEL_ACTION.SAVE_LEVEL:
                try {
                    saveLevel(payload.name, state.level);
                } catch (e) {
                    console.error(e);
                }
                break;

            case 'level/' + LEVEL_ACTION.LOAD_LEVEL: {
                try {
                    const data = await loadLevel(payload.name);
                    store.commit(MUTATION.SET_STATE_CONTENT, {content: data});
                } catch (e) {
                    console.error(e);
                }
            }
            break;
        }
    });
};
