import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('logic');

export default {
    computed: {
        ...mapGetters([
            'getInventoryItems',
            'getItemData',
            'getPlayerAttributeHP',
            'getPlayerAttributeHPMax',
            'isPlayerDead',
            'getStateContent',
            'getInventoryTotalValue'
        ])
    }
}
