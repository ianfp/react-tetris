import {Score} from "./Score";

describe("Score", () => {
    it("starts at zero", () => {
        const score = new Score();
        expect(score.points).toEqual(0);
    });

    it.each([
        [0, 0],
        [1, 1],
        [2, 3],
        [3, 6],
        [4, 10],
        [5, 10] // shouldn't happen -- four is the max
    ])("when adding %i completed rows, score increases by %i", (completedRows, expected) => {
        const score = new Score();
        const updated = score.update(completedRows);
        expect(updated.points).toEqual(expected);
    });

    it("is immutable", () => {
        const score = new Score();
        const updated = score.update(1);
        expect(score.points).toEqual(0);
        expect(updated.points).toEqual(1);
    });
});