import {createNamespacedHelpers} from 'vuex';
import * as MAIN_ACTIONS from '../store/modules/main/action-types';

const { mapGetters: mainGetters, mapActions: mainActions } = createNamespacedHelpers('main');

export default {
    methods: {
        ...mainActions({
            checkUserAuth: MAIN_ACTIONS.CHECK_USER_AUTH,
            logOut: MAIN_ACTIONS.USER_LOG_OUT,
            checkOnline: MAIN_ACTIONS.CHECK_ONLINE_STATUS
        })
    },
    computed: {
        ...mainGetters([
            'isUserAuthenticated',
            'getUserDisplayName',
            'isOnline',
            'isOffline',
            'getFlagOnline',
            'isUserAuthPending'
        ])
    }
}