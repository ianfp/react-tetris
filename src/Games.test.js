import {Game} from "./Game";
import {Ticks} from "./Ticks";

class FakeBoard {
    constructor(props) {
        this.canMove = props.canMoveDown ?? true;
        this.numCompletedRows = props.completedRows ?? 0;
        this.movedDown = 0;
        this.frozen = 0;
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

    countCompletedRows() {
        return this.numCompletedRows;
    }

    removeCompletedRows() {
        return this;
    }
}

describe("Game", () => {
    describe("dropOrFreezeCurrentPiece", () => {
        describe("should drop in two ticks", () => {
            const board = new FakeBoard({canMoveDown: true});
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
            const board = new FakeBoard({canMoveDown: true});
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
            const board = new FakeBoard({canMoveDown: false});
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
            const board = new FakeBoard({canMoveDown: false});
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

    describe("score", () => {
        it("is updated if there are completed rows", () => {
            const board = new FakeBoard({completedRows: 1});
            let game = new Game(board);
            game = game.freezeCurrentPiece();
            expect(game.getScore()).toEqual(1);
        });

        it("is unchanged if there are no completed rows", () => {
            const board = new FakeBoard({completedRows: 0});
            let game = new Game(board);
            game = game.freezeCurrentPiece();
            expect(game.getScore()).toEqual(0);
        });

        it("is preserved when the game updates", () => {
            const board = new FakeBoard({completedRows: 1});
            let game = new Game(board);
            game = game.freezeCurrentPiece();
            game = game.moveCurrentPieceDown();
            expect(game.getScore()).toEqual(1);
        });
    });
});