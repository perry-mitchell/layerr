import { assertError, isError } from "./error.js";
import { parseArguments } from "./tools.js";
import { LayerrInfo, LayerrOptions } from "./types.js";

export class Layerr extends Error {
    public _cause?: Error;
    public _info?: LayerrInfo;

    constructor(errorOptionsOrMessage?: LayerrOptions | string | Error, messageText?: string) {
        const args = [...arguments];
        const { options, shortMessage } = parseArguments(args);
        let message = shortMessage;
        if (options.cause) {
            message = `${message}: ${options.cause.message}`;
        }
        super(message);
        this.message = message;
        if (options.name && typeof options.name === "string") {
            this.name = options.name;
        } else {
            this.name = "Layerr";
        }
        if (options.cause) {
            Object.defineProperty(this, "_cause", { value: options.cause });
        }
        Object.defineProperty(this, "_info", { value: {} });
        if (options.info && typeof options.info === "object") {
            Object.assign(this._info, options.info);
        }
        if (Error.captureStackTrace) {
            const ctor = options.constructorOpt || this.constructor;
            Error.captureStackTrace(this, ctor);
        }
    }

    static cause(err: Layerr | Error): Layerr | Error | null {
        assertError(err);
        if (!(err as Layerr)._cause) return null;
        return isError((err as Layerr)._cause) ? (err as Layerr)._cause : null;
    }

    static fullStack(err: Layerr| Error): string {
        assertError(err);
        const cause = Layerr.cause(err);
        if (cause) {
            return `${err.stack}\ncaused by: ${Layerr.fullStack(cause)}`;
        }
        return err.stack;
    }

    static info(err: Layerr | Error): LayerrInfo {
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
    }

    cause(): Error | Layerr | null {
        return Layerr.cause(this);
    }

    toString(): string {
        let output = this.name || this.constructor.name || this.constructor.prototype.name;
        if (this.message) {
            output = `${output}: ${this.message}`;
        }
        return output;
    }
}
