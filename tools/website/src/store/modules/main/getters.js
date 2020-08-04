export default {
    isOnline: state => state.flags.online === 1,
    isOffline: state => state.flags.online === 0,
    isUserAuthenticated: state => state.user.auth,
    isUserAuthPending: state => state.user.pending,
    getUserDisplayName: state => state.user.name
}