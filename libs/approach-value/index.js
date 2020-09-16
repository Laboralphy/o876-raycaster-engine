export function approachValue(fGoal, fCurrent, fStep) {
    if (fGoal === fCurrent) {
        return fGoal;
    }
    if (Math.abs(fGoal - fCurrent) <= fStep) {
        return fGoal;
    } else if (fCurrent < fGoal) {
        return fCurrent + fStep;
    } else if (fCurrent > fGoal) {
        return fCurrent + fStep;
    }
}
