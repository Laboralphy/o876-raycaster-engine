/**
 * Intro Effect
 * Display flash photo and text
 */
import AbstractFilter from "libs/filters/AbstractFilter";
import CanvasHelper from "libs/canvas-helper";
import Easing from "libs/easing";

const FONT_SIZE = 12;
const FONT_ALPHA_TIME = 10;
const TIME_AT_0_LENGTH = 12;
const TIME_PER_CHAR = 3;
/*
- qq prob de tags
- la function text avait besoin du canvas
- la function easing.next doit etre remplacée par .compute
- aText indéfini, erreur dans la construction de la clé recherchant le texte
 */
class SimpleText extends AbstractFilter {
    constructor() {
        super();
        this.oCanvas = null;
        this.aText = null;
        this.oEasingAlpha = new Easing();
        this.nTime = 0;
        this.nPhase = 0;
        this.oInput = {};
        this
            .oEasingAlpha
            .reset()
            .from(0)
            .to(1)
            .steps(FONT_ALPHA_TIME)
            .use(Easing.SMOOTHSTEP);
    }

    processText() {
        const {text, x, y} = this.oInput;
        const cvs = this.oCanvas;
        const ctx = cvs.getContext('2d');
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.font = 'bold ' + FONT_SIZE + 'px monospace';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseLine = 'middle';
        this.nTime = TIME_AT_0_LENGTH;
        let yText = y;
        let xText = x;
        text.forEach(function(t, i) {
            ctx.strokeText(t, xText, yText);
            ctx.fillText(t, xText, yText);
            this.nTime += t.length * TIME_PER_CHAR;
            yText += FONT_SIZE * 1.2 | 0;
        }, this);
        this.nTime = Math.round(this.nTime);
    }

    text(aText, x, y) {
        this.oInput = {text: aText, x, y};
    }

    /** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
     */
    process() {
        switch (this.nPhase) {
            case 0:
                if (this.oEasingAlpha.compute().over()) {
                    ++this.nPhase;
                }
                break;

            case 1:
                if (--this.nTime <= 0) {
                    this
                        .oEasingAlpha
                        .reset()
                        .from(1)
                        .to(0)
                        .steps(FONT_ALPHA_TIME)
                        .use(Easing.SMOOTHSTEP);
                    ++this.nPhase;
                }
                break;

            case 2:
                if (this.oEasingAlpha.compute().over()) {
                    ++this.nPhase;
                }
                break;
        }
    }

    /** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
     */
    render(canvas) {
        if (this.oCanvas === null) {
            this.oCanvas = CanvasHelper.createCanvas(canvas.width, canvas.height);
            this.processText();
        }
        const cvs = this.oCanvas;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.globalAlpha = this.oEasingAlpha.y;
        ctx.drawImage(cvs, 0, 0);
        ctx.restore();
    }

    over() {
        return super.over() || this.nPhase > 2;
    }
}

export default SimpleText;
