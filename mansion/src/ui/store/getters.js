export default {
    getFirstPopup: state => state.popupTexts.length > 0 ? state.popupTexts[0] : null
};