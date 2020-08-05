import * as MUTATIONS from './mutation-types';

export default {
    [MUTATIONS.SET_USER_AUTH]: function(state, {value}) {
        state.user.auth = value;
    },
    [MUTATIONS.SET_USER_NAME]: function(state, {value}) {
        state.user.name = value;
    },
    [MUTATIONS.SET_USER_PENDING]: function(state, {value}) {
        state.user.pending = value;
    },
    [MUTATIONS.SET_FLAG_ONLINE]: function(state, {value}) {
        state.flags.online = value;
    }
}