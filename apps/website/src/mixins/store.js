import {createNamespacedHelpers} from 'vuex';
import * as MAIN_ACTIONS from '../store/modules/main/action-types';

const { mapGetters: mainGetters, mapActions: mainActions } = createNamespacedHelpers('main');

export default {
    methods: {
        ...mainActions({
            checkUserAuth: MAIN_ACTIONS.CHECK_USER_AUTH,
            logOut: MAIN_ACTIONS.USER_LOG_OUT,
            checkOnline: MAIN_ACTIONS.CHECK_ONLINE_STATUS,
            createUser: MAIN_ACTIONS.CREATE_USER
        })
    },
    computed: {
        ...mainGetters([
            'isUserAuthenticated',
            'getUserDisplayName',
            'getUserDisplayData',
            'isOnline',
            'isOffline',
            'getFlagOnline',
            'isUserAuthPending'
        ])
    }
}