interface ExtendedConstructor extends Function {
    super_?: Function;
}

export function assertError(err: Error) {
    if (!isError(err)) {
        throw new Error("Parameter was not an error");
    }
}

export function inherit(ctor: ExtendedConstructor, superCtor: Function) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}

export function isError(err: Error): boolean {
    return objectToString(err) === "[object Error]" || err instanceof Error;
}

function objectToString(obj: Object): string {
    return Object.prototype.toString.call(obj);
}

