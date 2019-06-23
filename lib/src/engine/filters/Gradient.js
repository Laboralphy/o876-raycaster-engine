import AbstractFilter from "../../filters/AbstractFilter";

class Gradient extends AbstractFilter {
    constructor(gradient) {
        super();
        this._gradient = gradient;
    }

    process(time) {
        super.process(time);
    }

    render(canvas) {
        super.render(canvas);
        const context = canvas.getContext('2d');
        context.save();
        context.fillStyle = this._gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}

export default Gradient;