import {arrayOf} from "./Arrays";
import {Piece} from "./Piece";
import {pickRandomShape} from "./Shape";
import {pos} from "./Position";

/**
 * The game board, including the current active piece and
 * all of the completed (frozen) pieces.
 *
 * An instance of this class represents the state of the board
 * at an instant in time, and as such is immutable.
 *
 * This class understands the rules of the game and can generate
 * subsequent board states.
 */
export class Board {
    constructor(height, width, currentPiece, completedBlocks) {
        this.height = height;
        this.width = width;
        this.currentPiece = currentPiece || this.nextPiece();
        this.completedBlocks = completedBlocks;
    }

    /**
     * Use this to create a new board for the start of the game.
     */
    static blank(height, width) {
        return new Board(height, width, null, []);
    }

    nextPiece() {
        return new Piece(pickRandomShape(), this.topMiddle());
    }

    topMiddle() {
        return pos(Math.floor(this.width / 2), 0);
    }

    getColorAt(position) {
        const block = this.allOccupiedBlocks().find(current => current.occupies(position));
        return block ? block.color : "none";
    }

    allOccupiedBlocks() {
        return this.completedBlocks.concat(this.currentPiece.decompose());
    }

    rows() {
        return arrayOf(this.height, (_, rowNo) => rowNo);
    }

    cols() {
        return arrayOf(this.width, (_, colNo) => colNo);
    }

    canMoveDown(piece) {
        return !this.isObstructed(piece.moveDown());
    }

    canMoveLeft(piece) {
        return !this.isObstructed(piece.moveLeft());
    }

    canMoveRight(piece) {
        return !this.isObstructed(piece.moveRight());
    }

    canBeRotated(piece) {
        return !this.isObstructed(piece.rotateClockwise());
    }

    isObstructed(piece) {
        return piece.occupiedPositions().some(position => this.isObstructedPosition(position));
    }

    isObstructedPosition(position) {
        return this.isOutOfBounds(position) || this.isOccupied(position);
    }

    isOutOfBounds(position) {
        return (
            position.x < 0
            || position.x >= this.width
            || position.y < 0
            || position.y >= this.height
        );
    }

    isOccupied(position) {
        return this.completedBlocks.some(block => block.occupies(position));
    }

    rotateCurrentPiece() {
        return (
            this.canBeRotated(this.currentPiece)
                ? this.updateCurrentPiece(this.currentPiece.rotateClockwise())
                : this
        );
    }

    updateCurrentPiece(newCurrentPiece) {
        return new Board(this.height, this.width, newCurrentPiece, this.completedBlocks);
    }

    freezeCurrentPiece() {
        return new Board(
            this.height,
            this.width,
            this.nextPiece(),
            this.completedBlocks.concat(this.currentPiece.decompose())
        );
    }

    zoomCurrentPieceDown() {
        return (
            this.canMoveDown(this.currentPiece)
                ? this.moveCurrentPieceDown()
                : this
        );
    }

    moveCurrentPieceDown() {
        return this.updateCurrentPiece(this.currentPiece.moveDown());
    }

    moveCurrentPieceLeft() {
        return (
            this.canMoveLeft(this.currentPiece)
                ? this.updateCurrentPiece(this.currentPiece.moveLeft())
                : this
        );
    }

    moveCurrentPieceRight() {
        return (
            this.canMoveRight(this.currentPiece)
                ? this.updateCurrentPiece(this.currentPiece.moveRight())
                : this
        );
    }

    removeCompletedRows() {
        let updatedBoard = this;
        this.rows().forEach(rowNo => {
            if (updatedBoard.isCompleteRow(rowNo)) {
                updatedBoard = updatedBoard.deleteRow(rowNo);
                updatedBoard = updatedBoard.moveEverythingDown(rowNo);
            }
        });
        return updatedBoard;
    }

    isCompleteRow(rowNo) {
        return this.cols().every(colNo => this.isOccupied(pos(colNo, rowNo)));
    }

    deleteRow(rowNo) {
        return this.updateCompletedBlocks(
            this.completedBlocks.filter(block => !block.isInRow(rowNo))
        );
    }

    updateCompletedBlocks(newCompletedBlocks) {
        return new Board(this.height, this.width, this.currentPiece, newCompletedBlocks);
    }

    /**
     * Move completed blocks above the given rowNo down.
     *
     * This happens after a row is completed.
     *
     * @return Board the updated board
     */
    moveEverythingDown(rowNo) {
        return this.updateCompletedBlocks(
            this.completedBlocks
                .map(block => block.isAbove(rowNo) ? block.moveDown() : block)
        );
    }
}
