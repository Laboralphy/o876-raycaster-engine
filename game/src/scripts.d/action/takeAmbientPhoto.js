import * as CONSTS from '../../consts';

export function main(game, ref, score = 0) {
    game.storePhoto(
        CONSTS.PHOTO_TYPE_AMBIENT, // type de photo
        score,                  // score de la photo
        ref,                    // information supplémentaire (titre, description)
    );
    game.engine.delayCommand(
        () => game.ui.popup('EVENT_PHOTO_NAMED_STORED', 'album-ambient', 'PHOTOS.' + ref + '.title'),
        CONSTS.DELAY_BETWEEN_PHOTO_AND_POPUP
    );
}
