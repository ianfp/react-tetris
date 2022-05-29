import {Game} from "./Game";
import {Ticks} from "./Ticks";

class FakeBoard {
    constructor(canMoveDown) {
        this.canMove = canMoveDown;
        this.movedDown = 0;
        this.frozen = 0;
    }

    static thatCanMoveDown() {
        return new FakeBoard(true);
    }

    static thatCannotMoveDown() {
        return new FakeBoard(false);
    }

    canMoveDown() {
        return this.canMove;
    }

    moveCurrentPieceDown() {
        ++this.movedDown;
        return this;
    }

    freezeCurrentPiece() {
        ++this.frozen;
        return this;
    }

    removeCompletedRows() {
        return this;
    }
}

describe("Game", () => {
    describe("dropOrFreezeCurrentPiece", () => {
        describe("should drop in two ticks", () => {
            const board = FakeBoard.thatCanMoveDown();
            let game = new Game(board, new Ticks(2, 2));
            game = game.dropOrFreezeCurrentPiece();

            it("does not move the current piece", () => {
                expect(board.movedDown).toEqual(0);
            });

            it("drops on the second tick", () => {
                game.dropOrFreezeCurrentPiece();
                expect(board.movedDown).toEqual(1);
            });
        });

        describe("should drop on the next tick", () => {
            const board = FakeBoard.thatCanMoveDown();
            let game = new Game(board, new Ticks(1, 2));
            game = game.dropOrFreezeCurrentPiece();

            it("moves the current piece down once", () => {
                expect(board.movedDown).toEqual(1);
            });

            it("does not move the piece twice in a row", () => {
                game.dropOrFreezeCurrentPiece();
                expect(board.movedDown).toEqual(1);
            });
        });

        describe("should not freeze on the next tick", () => {
            const board = FakeBoard.thatCannotMoveDown();
            let game = new Game(board, new Ticks(2, 2));
            game = game.dropOrFreezeCurrentPiece();

            it("does not freeze the current piece", () => {
                expect(board.frozen).toEqual(0);
            });

            it("freezes on the second tick", () => {
                game.dropOrFreezeCurrentPiece();
                expect(board.frozen).toEqual(1);
            });
        });

        describe("should freeze on the next tick", () => {
            const board = FakeBoard.thatCannotMoveDown();
            let game = new Game(board, new Ticks(2, 1));
            game = game.dropOrFreezeCurrentPiece();

            it("freezes the current piece down once", () => {
                expect(board.frozen).toEqual(1);
            });

            it("does not freeze the piece twice in a row", () => {
                game.dropOrFreezeCurrentPiece();
                expect(board.frozen).toEqual(1);
            });
        });
    });
});