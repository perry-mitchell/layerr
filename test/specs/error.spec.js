import { expect } from "chai";
import { Layerr, assertError, isError } from "../../dist/index.js";

describe("assertError", function() {
    it("does not throw for Error instances", function() {
        expect(() => {
            assertError(new Error("test"));
        }).to.not.throw();
    });

    it("does not throw for Layerr instances", function() {
        expect(() => {
            assertError(new Layerr("test"));
        }).to.not.throw();
    });

    it("throws for other items", function() {
        expect(() => {
            assertError({});
        }).to.throw(/not an error/i);
    });
});

describe("isError", function() {
    it("recognises standard errors", function() {
        expect(isError(new Error("Error"))).to.be.true;
    });

    it("returns false for non-errors", function() {
        expect(isError()).to.be.false;
        expect(isError(0)).to.be.false;
        expect(isError("Error")).to.be.false;
        expect(isError(null)).to.be.false;
        expect(isError({})).to.be.false;
    });

    it("recognises Layerr instances", function() {
        expect(isError(new Layerr("Error"))).to.be.true;
    });
});
