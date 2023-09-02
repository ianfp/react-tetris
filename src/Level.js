import {arrayOf} from "./Arrays";

const NUM_LEVELS = 10;

/**
 * The difficulty level of the game.
 */
export class Level {
    constructor(index) {
        /**
         * Zero-based index.
         */
        this.index = index;

        /**
         * One-based index for human consumption.
         */
        this.levelNo = index + 1;

        /**
         * The number of points required to reach this level.
         */
        this.requiredScore = calcRequiredScore(this.index);

        /**
         * The number of ticks before pieces drop or freeze.
         *
         * A lower number means a faster game.
         */
        this.ticks = (NUM_LEVELS - index);
    }
}

function calcRequiredScore(index) {
    let requiredScore = 0;
    let nextDelta = 8;
    for (let current = 0; current < index; ++current) {
        requiredScore = requiredScore + nextDelta;
        nextDelta = 1.5 * nextDelta;
    }
    return requiredScore;
}

const LEVELS = arrayOf(NUM_LEVELS, (_, index) => new Level(index));

/**
 * @return {Level} the correct level for the given score.
 */
export function getLevel(currentScore) {
    let result = null;
    for (const level of LEVELS) {
        if (level.requiredScore <= currentScore) {
            result = level;
        }
    }
    return result;
}
