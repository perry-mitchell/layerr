import { expect } from "chai";
import { Layerr } from "../../dist/index.js";

describe("Layer", function () {
    it("can be instantiated with error", function () {
        expect(() => {
            new Layerr();
        }).to.not.throw();
    });

    it("throws if invoked as a function", function () {
        expect(() => {
            Layerr();
        }).to.throw(/Class constructor.+cannot be invoked/i);
    });

    describe("instance", function () {
        describe("cause", function () {
            it("returns undefined if no parent", function () {
                const err = new Layerr("");
                expect(Layerr.cause(err)).to.be.null;
            });

            it("returns parent if provided", function () {
                const err1 = new Layerr("test");
                const err2 = new Layerr(err1, "test2");
                expect(Layerr.cause(err2)).to.equal(err1);
            });
        });

        describe("message", function () {
            it("sets the correct message", function () {
                const err = new Layerr("Failed!");
                expect(err.message).to.equal("Failed!");
            });

            it("sets the correct message when inheriting from Error", function () {
                const err1 = new Error("Problemo");
                const err2 = new Layerr(err1, "Failed");
                expect(err2.message).to.equal("Failed: Problemo");
            });

            it("sets the correct message when inheriting from Layerr", function () {
                const err1 = new Error("Problemo");
                const err2 = new Layerr(err1, "Explosion");
                const err3 = new Layerr(err2, "Failed");
                expect(err3.message).to.equal("Failed: Explosion: Problemo");
            });
        });

        describe("toString", function () {
            it("outputs name and message", function () {
                const err = new Layerr("Boom");
                expect(err.toString()).to.equal("Layerr: Boom");
            });

            it("outputs overridden name", function () {
                const err = new Layerr(
                    {
                        name: "TestError",
                    },
                    "Boom"
                );
                expect(err.toString()).to.equal("TestError: Boom");
            });
        });
    });

    describe("static", function () {
        describe("fullStack", function () {
            it("returns stacks from all errors", function () {
                const err1 = new Layerr("Top");
                const err2 = new Layerr(err1, "Middle");
                const err3 = new Layerr(err2, "Bottom");
                expect(Layerr.fullStack(err3)).to.contain(
                    Layerr.fullStack(err2)
                );
                expect(Layerr.fullStack(err2)).to.contain(
                    Layerr.fullStack(err1)
                );
            });
        });

        describe("info", function () {
            it("returns an empty object if standard error", function () {
                expect(Layerr.info(new Error())).to.deep.equal({});
            });

            it("returns expected properties from Layerr instance", function () {
                const err = new Layerr(
                    { info: { a: true, b: false } },
                    "Problemo"
                );
                expect(Layerr.info(err)).to.deep.equal({
                    a: true,
                    b: false,
                });
            });

            it("returns merged properties from several instances", function () {
                const err1 = new Layerr(
                    { info: { a: true, b: false } },
                    "Problemo"
                );
                const err2 = new Layerr(
                    { cause: err1, info: { b: true, c: false } },
                    "Problemo"
                );
                expect(Layerr.info(err2)).to.deep.equal({
                    a: true,
                    b: true,
                    c: false,
                });
            });
        });
    });
});
