import {createNamespacedHelpers} from 'vuex';
import * as UI_MUTATIONS from '../../store/modules/ui/mutation-types';


const {mapGetters: uiGetters, mapMutations: uiMutations} = createNamespacedHelpers('ui');


export default {
    computed: {
        ...uiGetters([
            'getMainMenuPhase'
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
        ...uiMutations({
            'setPhase': UI_MUTATIONS.SET_MAIN_MENU_PHASE
        })
    }
}
