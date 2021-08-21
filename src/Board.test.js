import {Board} from "./Board";
import {Piece} from "./Piece";
import {SQUAREY} from "./Shape";
import {pos} from "./Position";
import {Block} from "./Block";

describe("Board", () => {
    describe("freezeCurrentPiece", () => {
        const currentPiece = new Piece(SQUAREY, pos(3, 3));
        const board = new Board(4, 4, currentPiece, []);
        const result = board.freezeCurrentPiece();

        it("generates new current piece", () => {
            expect(result.currentPiece).not.toBe(currentPiece);
        });

        it("decomposes previous piece", () => {
            [pos(0, 3), pos(1, 3), pos(0, 2), pos(1, 2)]
                .forEach(position => result.isOccupied(position));
        });
    })

    describe("removeCompletedRows", () => {
        it("removes adjacent rows", () => {
            const board = new Board(4, 4, null, [
                // bottom row
                blockAt(0, 3), blockAt(1, 3), blockAt(2, 3), blockAt(3, 3),
                // immediately above
                blockAt(0, 2), blockAt(1, 2), blockAt(2, 2), blockAt(3, 2),
            ]);

            const result = board.removeCompletedRows();
            expect(result.completedBlocks).toHaveLength(0);
        });
    });
});

function blockAt(x, y) {
    return new Block("red", pos(x, y));
}
