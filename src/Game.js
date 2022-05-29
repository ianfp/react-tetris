import {Ticks} from "./Ticks";
import {Score} from "./Score";

/**
 * This is the parent model class that represents the entire game state.
 *
 * It handles animation and responds to user input.
 *
 * Like all models in this app, it is immutable and spawns new instances
 * of itself for any state changes.
 */
export class Game {
    constructor(board, ticks = new Ticks(), score = new Score()) {
        this.board = board;
        this.ticks = ticks;
        this.score = score;
    }

    isOver() {
        return this.board.isGameOver();
    }

    /**
     * Determines if the current piece should either drop or freeze on the
     * current animation frame and updates the game state accordingly.
     *
     * @return {Game} the updated game
     */
    dropOrFreezeCurrentPiece() {
        if (this.board.canMoveDown()) {
            const newTicks = this.ticks.decrementDrop();
            return newTicks.shouldDrop() ? this.moveCurrentPieceDown() : this.updateTicks(newTicks);
        } else {
            const newTicks = this.ticks.decrementFreeze();
            return newTicks.shouldFreeze() ? this.freezeCurrentPiece() : this.updateTicks(newTicks);
        }
    }

    /**
     * Move the current piece down and reset the drop timer.
     *
     * We reset the drop timer regardless of whether the piece moves down
     * by "gravity" or the player moves it. In the latter case, failure to
     * reset the timer causes an occasional "double drop", which creates a
     * jarring experience for the player.
     *
     * @return {Game} the updated game
     */
    moveCurrentPieceDown() {
        return this.updateTicks(this.ticks.resetDrop()).updateBoard(this.board.moveCurrentPieceDown());
    }

    /**
     * @return {Game} the updated game
     */
    freezeCurrentPiece() {
        const updatedBoard = this.board.freezeCurrentPiece();
        const newScore = this.score.update(updatedBoard.countCompletedRows());
        return this.updateTicks(this.ticks.resetFreeze())
            .updateBoard(updatedBoard.removeCompletedRows())
            .updateScore(newScore);
    }

    /**
     * @return {Game} the updated game
     */
    rotateCurrentPiece() {
        return this.updateBoard(this.board.rotateCurrentPiece());
    }

    /**
     * @return {Game} the updated game
     */
    moveCurrentPieceLeft() {
        return this.updateBoard(this.board.moveCurrentPieceLeft());
    }

    /**
     * @return {Game} the updated game
     */
    moveCurrentPieceRight() {
        return this.updateBoard(this.board.moveCurrentPieceRight());
    }

    /**
     * Restarts the game.
     *
     * @return {Game} the updated game
     */
    restart() {
        return this.updateBoard(this.board.clear());
    }

    /**
     * The current total number of points the player has earned.
     *
     * @return {number}
     */
    getScore() {
        return this.score.points;
    }

    /**
     * @private
     * @return {Game} the updated game
     */
    updateBoard(newBoard) {
        return new Game(newBoard, this.ticks, this.score);
    }

    /**
     * @private
     * @return {Game} the updated game
     */
    updateTicks(newTicks) {
        return new Game(this.board, newTicks, this.score);
    }

    /**
     * @private
     * @return {Game} the updated game
     */
    updateScore(newScore) {
        return new Game(this.board, this.ticks, newScore);
    }
}

