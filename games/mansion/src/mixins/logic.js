import {createNamespacedHelpers} from 'vuex';
import * as LOGIC_MUTATIONS_TYPES from '../store/modules/logic/mutation-types'

const {mapGetters, mapMutations} = createNamespacedHelpers('logic');

export default {
    computed: {
        ...mapGetters([
            'getInventoryItems',
            'getItemData',
            'getPlayerAttributeHP',
            'getPlayerAttributeHPMax',
            'isPlayerDead',
            'getStateContent',
            'getInventoryTotalValue',
            'getCombatScore'
        ])
    },
    methods: {
        ...mapMutations({
            incCombatScore: LOGIC_MUTATIONS_TYPES.INC_SCORE
        })
    }
}
