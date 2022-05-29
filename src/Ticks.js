/**
 * The number of ticks it takes "gravity" to pull the current piece down one square.
 */
const GRAVITY_SPEED = 10;

/**
 * Keeps track of how many animation frames (called "ticks" for short)
 * remain before certain events need to occur.
 */
export class Ticks {
    constructor(untilDrop = GRAVITY_SPEED, untilFreeze = GRAVITY_SPEED) {
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

    resetDrop() {
        return new Ticks(GRAVITY_SPEED, this.untilFreeze);
    }

    resetFreeze() {
        return new Ticks(this.untilDrop, GRAVITY_SPEED);
    }
}