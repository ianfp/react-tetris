import {pos} from "./Position";

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

    describe("rotateClockwise", () => {
        it("origin stays", () => {
            expect(pos(0, 0).rotateClockwise().equals(pos(0, 0))).toBeTruthy();
        });
        it("first quadrant", () => {
            expect(pos(2, 1).rotateClockwise().equals(pos(-1, 2))).toBeTruthy();
        });
    });
});
