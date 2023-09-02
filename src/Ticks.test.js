import {Ticks} from "./Ticks";

describe("Ticks", () => {
    describe("when positive", () => {
        const ticks = new Ticks(1, 1);
        it("should not drop", () => {
            expect(ticks.shouldDrop()).toBe(false);
        });
        it("should not freeze", () => {
            expect(ticks.shouldFreeze()).toBe(false);
        });
    });

    describe("when decrement drop to zero", () => {
        const ticks = new Ticks(1, 1).decrementDrop();
        it("should drop", () => {
            expect(ticks.shouldDrop()).toBe(true);
        });
        it("should not freeze", () => {
            expect(ticks.shouldFreeze()).toBe(false);
        });
    });

    describe("when decrement freeze to zero", () => {
        const ticks = new Ticks(1, 1).decrementFreeze();
        it("should not drop", () => {
            expect(ticks.shouldDrop()).toBe(false);
        });
        it("should freeze", () => {
            expect(ticks.shouldFreeze()).toBe(true);
        });
    });

    describe("when reset drop", () => {
        const ticks = new Ticks(0, 0).resetDrop();
        it("should not drop", () => {
            expect(ticks.shouldDrop()).toBe(false);
        });
    });

    describe("when reset freeze", () => {
        const ticks = new Ticks(0, 0).resetFreeze();
        it("should not freeze", () => {
            expect(ticks.shouldFreeze()).toBe(false);
        });
    });

    describe("reset drop", () => {
        const ticks = new Ticks(0, 0).resetDrop(4);
        it("works", () => {
            expect(ticks.shouldDrop()).toBe(false);
        });
    });

    describe("reset freeze", () => {
        const ticks = new Ticks(0, 0).resetFreeze(1);
        it("works", () => {
            expect(ticks.shouldFreeze()).toBe(false);
        });
    });
});
