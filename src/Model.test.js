import {LINE, Piece, pos} from "./Model";

describe("Position", () => {
    const original = pos(4, 5);

    describe("add", () => {
        it("works with origin", () => {
            const result = original.add(pos(0, 0));
            expect(result.x).toEqual(4);
            expect(result.y).toEqual(5);
        });

        it("works with positive numbers", () => {
            const result = original.add(pos(3, 11));
            expect(result.x).toEqual(7);
            expect(result.y).toEqual(16);
        });

        it("works with negative numbers", () => {
            const result = original.add(pos(-3, -8));
            expect(result.x).toEqual(1);
            expect(result.y).toEqual(-3);
        });
    });

    describe("equals", () => {
        it("returns true when equal", () => {
            expect(original.equals(pos(4, 5))).toBeTruthy();
        });

        it("returns false when not equal", () => {
            expect(original.equals(pos(5, 5))).toBeFalsy();
            expect(original.equals(pos(4, 4))).toBeFalsy();
        });
    });
});

describe("Piece", () => {
    describe("occupies", () => {
        const piece = new Piece(LINE, pos(3, 3));
        [pos(3, 3), pos(4, 3), pos(5,3), pos(6,3)].forEach(expected => {
            it(`is true for ${expected}`, () => {
                expect(piece.occupies(expected)).toBeTruthy();
            });
        });

        [pos(2,3), pos(4,4), pos(4,2), pos(7,3)].forEach(notExpected => {
            it(`is false for ${notExpected}`, () => {
                expect(piece.occupies(notExpected)).toBeFalsy();
            });
        });
    });
});
