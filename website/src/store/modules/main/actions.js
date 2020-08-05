import * as ACTIONS from './action-types';
import * as MUTATIONS from './mutation-types';

import {fetchJSON} from 'libs/fetch-json';

export default {
    [ACTIONS.CHECK_USER_AUTH]: async function({commit, dispatch}) {
        commit(MUTATIONS.SET_USER_PENDING, {value: true});
        const oResult = await fetchJSON('/user.json');
        if (!!oResult && oResult.auth) {
            const d = new Date(oResult.date);
            commit(MUTATIONS.SET_USER_AUTH, {value: true});
            commit(MUTATIONS.SET_USER_NAME, {value: oResult.name});
            commit(MUTATIONS.SET_USER_DATE, {value: d.toLocaleDateString()});
            console.log(oResult)
        } else {
            commit(MUTATIONS.SET_USER_AUTH, {value: false});
            commit(MUTATIONS.SET_USER_NAME, {value: ''});
            commit(MUTATIONS.SET_USER_DATE, {value: ''});
        }
        commit(MUTATIONS.SET_USER_PENDING, {value: false});
    },

    [ACTIONS.USER_LOG_OUT]: function({commit}) {

    },

    [ACTIONS.CHECK_ONLINE_STATUS]: async function({commit, getters}) {
        if (getters.isOnline === false && getters.isOffline === false) {
            const {result} = await fetchJSON('/online');
            commit(MUTATIONS.SET_FLAG_ONLINE, {value: result ? 1 : 0});
        }
    }
}