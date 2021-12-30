import * as CONSTS from '../../consts';

export function main(game, ref, locator, duration, score = 0) {
    const oWraith = game.spawnGhost(ref, locator);
    const oLocator = game.getLocator(locator + '_target');
    if (!oLocator) {
        throw new Error(locator + '_target: is not a valid spawn point for the wraith ' + ref);
    }
    oWraith
        .data
        .wraith = {
            destination: game.getLocator(locator + '_target').position,
            duration,
            score
        };
    return oWraith;
}
