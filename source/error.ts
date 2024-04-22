export function assertError(err: unknown): asserts err is Error {
    if (!isError(err)) {
        throw new Error("Parameter was not an error");
    }
}

export function isError(err: unknown): boolean {
    return (
        (!!err &&
            typeof err === "object" &&
            objectToString(err) === "[object Error]") ||
        err instanceof Error
    );
}

function objectToString(obj: Object): string {
    return Object.prototype.toString.call(obj);
}
