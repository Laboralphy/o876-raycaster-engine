import {createNamespacedHelpers} from 'vuex';
import * as MUTATIONS from '../store/modules/logic/mutation-types';

const {mapGetters, mapMutations} = createNamespacedHelpers('logic');

export default {
    computed: {
        ...mapGetters([
            'getInventoryItems',
            'getItemData',
            'getPlayerAttributeHP',
            'getPlayerAttributeHPMax'
        ])
    }
}