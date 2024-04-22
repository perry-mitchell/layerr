const NAME = "Layerr";

let __name: string = NAME;

export function getGlobalName(): string {
    return __name;
}

export function setGlobalName(name: string | null = null): void {
    __name = name ?? NAME;
}
