import STRINGS from "../../../assets/strings";
import SimpleText from "../../filters/SimpleText";
import Link from "../../../../../libs/engine/filters/Link";
const STORY = STRINGS.PLOT_SUMMARY;

export function main(game, remove, x, y) {
    const aST = STORY.map(s => {
        const oText = new SimpleText();
        const cvs = game.engine.raycaster.renderCanvas;
        oText.text(s, cvs.width >> 1, cvs.height >> 1);
        return oText;
    });
    const oLink = new Link(aST);
    game
        .engine
        .filters
        .link(oLink);
    remove();
}
