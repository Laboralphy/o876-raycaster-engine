import STRINGS from "../../../assets/strings";
import SimpleText from "../../filters/SimpleText";
const STORY = STRINGS.MAIN_MENU_PLOT_SUMMARY;

export function main(game, remove, x, y, nStep) {
    const sStep = 'step' + nStep;
    const aText = STORY[sStep];
    const oText = new SimpleText();
    oText.text(aText, 200, 125);
    game.engine.filters.link(oText);
    remove();
}
