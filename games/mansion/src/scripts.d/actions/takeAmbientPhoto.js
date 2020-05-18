export async function main(game, ref, score = 0) {
    const p0 = game.capture();
    const p1 = game.storePhoto(
        'ambient',                // type de photo
        score,                   // score de la photo
        CLUE_REF,      // information supplémentaire (titre, description)
        pos                     // position d'ou doit etre prise la photo
    );
    await game.runScript('actions.photoMogrify', p0, p1);
    await game.ui.popup('EVENT_PHOTO_MOGRIFIED', 'photo-mogrify');
    game.ui.popup('EVENT_PHOTO_CLUE_STORED', 'album-clue');
}
