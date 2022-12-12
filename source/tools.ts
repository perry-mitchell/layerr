import { isError } from "./error.js";
import { LayerrOptions } from "./types.js";

export function parseArguments(args: Array<any>): { options: LayerrOptions, shortMessage: string } {
    let options: LayerrOptions,
        shortMessage = "";
    if (args.length === 0) {
        options = {};
    } else if (isError(args[0])) {
        options = {
            cause: args[0]
        };
        shortMessage = args.slice(1).join(" ") || "";
    } else if (args[0] && typeof args[0] === "object") {
        options = Object.assign({}, args[0]);
        shortMessage = args.slice(1).join(" ") || "";
    } else if (typeof args[0] === "string") {
        options = {};
        shortMessage = shortMessage = args.join(" ") || "";
    } else {
        throw new Error("Invalid arguments passed to Layerr");
    }
    return {
        options,
        shortMessage
    };
}
