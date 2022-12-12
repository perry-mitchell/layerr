export function assertError(err: Error) {
    if (!isError(err)) {
        throw new Error("Parameter was not an error");
    }
}

export function isError(err: Error): boolean {
    return objectToString(err) === "[object Error]" || err instanceof Error;
}

function objectToString(obj: Object): string {
    return Object.prototype.toString.call(obj);
}
