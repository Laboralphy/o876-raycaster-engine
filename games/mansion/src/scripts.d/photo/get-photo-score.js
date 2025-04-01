import * as CONSTS from '../../consts'

export function getPhotoScore (score) {
    if (score === undefined) {
        return 0
    }
    if (typeof score === 'number') {
        return score
    }
    if (!isNaN(+score)) {
        return +score
    }
    switch (score) {
        case 'common': {
            return CONSTS.PHOTO_SCORE_COMMON
        }
        case 'uncommon': {
            return CONSTS.PHOTO_SCORE_UNCOMMON
        }
        case 'rare': {
            return CONSTS.PHOTO_SCORE_RARE
        }
        case 'epic': {
            return CONSTS.PHOTO_SCORE_RARE
        }
        case 'legendary': {
            return CONSTS.PHOTO_SCORE_LEGENDARY
        }
    }
}
