/**
 * Keeps track of how many animation frames (called "ticks" for short)
 * remain before certain events need to occur.
 */
export class Ticks {
    constructor(untilDrop, untilFreeze) {
        /**
         * How many ticks remain until "gravity" pulls the current piece down one square.
         */
        this.untilDrop = untilDrop;

        /**
         * How many ticks remain until the current piece is locked in place.
         */
        this.untilFreeze = untilFreeze;
    }

    decrementDrop() {
        return new Ticks(this.untilDrop - 1, this.untilFreeze);
    }

    decrementFreeze() {
        return new Ticks(this.untilDrop, this.untilFreeze - 1);
    }

    shouldDrop() {
        return this.untilDrop <= 0;
    }

    shouldFreeze() {
        return this.untilFreeze <= 0;
    }

    resetDrop(ticks) {
        return new Ticks(ticks, this.untilFreeze);
    }

    resetFreeze(ticks) {
        return new Ticks(this.untilDrop, ticks);
    }
}
