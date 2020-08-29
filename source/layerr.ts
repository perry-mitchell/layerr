import { assertError, inherit, isError } from "./error";
import { parseArguments } from "./tools";
import { LayerrOptions } from "./types";

export function Layerr(errorOptionsOrMessage?: LayerrOptions | string | Error, messageText?: string) {
    const args = [...arguments];
    if (this instanceof Layerr === false) {
        throw new Error("Cannot invoke 'Layerr' like a function: It must be called with 'new'");
    }
    const { options, shortMessage } = parseArguments(args);
    this.name = "Layerr";
    if (options.name && typeof options.name === "string") {
        this.name = options.name;
    }
    let message = shortMessage;
    if (options.cause) {
        Object.defineProperty(this, "_cause", { value: options.cause });
        message = `${message}: ${options.cause.message}`;
    }
    this.message = message;
    Object.defineProperty(this, "_info", { value: {} });
    if (options.info && typeof options.info === "object") {
        Object.assign(this._info, options.info);
    }
    Error.call(this, message);
    if (Error.captureStackTrace) {
        const ctor = options.constructorOpt || this.constructor;
        Error.captureStackTrace(this, ctor);
    }
    return this;
}

inherit(Layerr, Error);

Layerr.prototype.cause = function _getCause() {
    return Layerr.cause(this) || undefined;
};

Layerr.prototype.toString = function _toString() {
    let output = this.name || this.constructor.name || this.constructor.prototype.name;
    if (this.message) {
        output = `${output}: ${this.message}`;
    }
    return output;
};


Layerr.cause = function __getCause(err: Layerr) {
    assertError(err);
    return isError(err._cause) ? err._cause : null;
};

Layerr.fullStack = function __getFullStack(err) {
    assertError(err);
    const cause = Layerr.cause(err);
    if (cause) {
        return `${err.stack}\ncaused by: ${Layerr.fullStack(cause)}`;
    }
    return err.stack;
};

Layerr.info = function __getInfo(err) {
    assertError(err);
    const output = {};
    const cause = Layerr.cause(err);
    if (cause) {
        Object.assign(output, Layerr.info(cause));
    }
    if (err._info) {
        Object.assign(output, err._info);
    }
    return output;
};
