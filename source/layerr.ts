import { assertError, inherit, isError } from "./error";
import { parseArguments } from "./tools";
import { LayerrInfo, LayerrOptions } from "./types";

interface Layerr extends Error {
    _cause?: Error;
    _info?: LayerrInfo
}

export function Layerr(errorOptionsOrMessage?: LayerrOptions | string | Error, messageText?: string): void {
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

Layerr.prototype.cause = function _getCause(): Error | Layerr | null {
    return Layerr.cause(this) || undefined;
};

Layerr.prototype.toString = function _toString(): string {
    let output = this.name || this.constructor.name || this.constructor.prototype.name;
    if (this.message) {
        output = `${output}: ${this.message}`;
    }
    return output;
};


Layerr.cause = function __getCause(err: Layerr): Error | Layerr | null {
    assertError(err);
    return isError(err._cause) ? err._cause : null;
};

Layerr.fullStack = function __getFullStack(err: Error | Layerr): string {
    assertError(err);
    const cause = Layerr.cause(err);
    if (cause) {
        return `${err.stack}\ncaused by: ${Layerr.fullStack(cause)}`;
    }
    return err.stack;
};

Layerr.info = function __getInfo(err: Error | Layerr): LayerrInfo {
    assertError(err);
    const output = {};
    const cause = Layerr.cause(err);
    if (cause) {
        Object.assign(output, Layerr.info(cause));
    }
    if ((<Layerr>err)._info) {
        Object.assign(output, (<Layerr>err)._info);
    }
    return output;
};
