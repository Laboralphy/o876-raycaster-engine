import {createNamespacedHelpers} from 'vuex';
import * as MUTATIONS from '../store/modules/ui/mutation-types';

const {mapGetters, mapMutations} = createNamespacedHelpers('ui');

export default {
    computed: {
        ...mapGetters([
            'getInventoryActiveTab',
            'getMainMenuPhase',
            'getPhotoDetailsContent',
            'getPhotoDetailsDescription',
            'getPhotoDetailsTitle',
            'getPhotoDetailsValue',
            'getPopup',
            'getShotScore',
            'getStoryData',
            'getUIActiveTab',
            'isControlsPageDisplayed',
            'isHUDVisible',
            'isMainMenuPageDisplayed',
            'isLoadingPageDisplayed',
            'isMainMenuVisible',
            'isPhotoDetailsVisible',
            'isShotClose',
            'isShotCore',
            'isShotDamaging',
            'isShotDouble',
            'isShotFatal',
            'isShotMultiple',
            'isShotTriple',
            'isShotVisible',
            'isShotZero',
            'isStoryPageDisplayed',
            'isUIFrameFullyVisible',
            'isUIFrameVisible',
            'getNotes',
            'getActiveNoteTab',
            'isGameOverPromptVisible'
        ]),
        phase: {
            get: function() {
                return this.getMainMenuPhase;
            },
            set: function(value) {
                this.setPhase({value})
            }
        }
    },
    methods: {
        ...mapMutations({
            setPhase: MUTATIONS.SET_MAIN_MENU_PHASE,
            setActiveTab: MUTATIONS.SET_MAIN_ACTIVE_TAB,
            setActiveType: MUTATIONS.SET_ITEM_TYPE_ACTIVE_TYPE,
            setPhotoDetails: MUTATIONS.SET_PHOTO_DETAILS,
            setNoteActiveType: MUTATIONS.SET_NOTE_SELECTED_TYPE
        })
    }
}
