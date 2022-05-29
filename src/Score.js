/**
 * Maps the number of completed rows (the array indexes) to the
 * number of points earned.
 */
const POINTS_EARNED = [
    0,
    1,
    3,
    6,
    10
];

const MAX_COMPLETED_ROWS = POINTS_EARNED.length - 1;

/**
 * Keeps track of the player's current score.
 */
export class Score {
    constructor(totalPoints = 0) {
        this.points =  totalPoints;
    }

    update(completedRows) {
        if (completedRows > MAX_COMPLETED_ROWS) {
            console.warn("Impossible number of completed rows given:", completedRows);
            completedRows = MAX_COMPLETED_ROWS;
        }
        const newPoints = POINTS_EARNED[completedRows];
        return new Score(this.points + newPoints);
    }
}