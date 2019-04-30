import * as ACTION from '../modules/level/action-types';
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

    store.subscribeAction(async (action, state) => {
        const payload = action.payload;

        switch (action.type) {
            case 'level/' + ACTION.SAVE_LEVEL:
                return saveLevel(payload.name, state);

            case 'level/' + ACTION.LOAD_LEVEL: {
                try {
                    const data = await loadLevel(payload.name);
                    store.commit(MUTATION.SET_STATE_CONTENT, {content: data});
                } catch (e) {
                    throw e;
                }
            }
        }
    });
};
