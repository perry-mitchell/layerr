# Layerr

> Errors, with layers..

[![NPM Downloads](https://img.shields.io/npm/dm/layerr)](https://www.npmjs.com/package/layerr)

A NodeJS and Web `Error` wrapping utility, based heavily on [VError](https://github.com/joyent/node-verror), but without all the extras and dependencies on Node core utilities. Written in Typescript, compiled to JavaScript and suitable for bundling in the browser.

Uses no dependencies, minifies well and is a great way to wrap errors as they propagate through complex applications (such as Express services, for instance).

_Layerr is an ESM library, and as such you need a compatible environment in which to install and use it._

## Installation

Install by running: `npm install layerr`.

## Usage

Use it as a regular error:

```typescript
const { Layerr } = require("layerr");

throw new Layerr("Test error");
```

Or use it to wrap errors:

```typescript
doSomething().catch((err) => {
    throw new Layerr(err, "Failed doing something");
});
```

Layerr's can have info attached:

```typescript
const { Layerr } = require("layerr");

function somethingElse() {
    throw new Layerr(
        {
            info: {
                code: 123,
            },
        },
        "Problem"
    );
}

somethingElse().catch((err: Layerr) => {
    const { code } = Layerr.info(err);
    // code === 123
});
```

### Global Name

By default Layerr names all created errors as `Layerr`. You can change this name by calling `setGlobalName`, and revert it by passing `null` to this function:

```typescript
import { Layerr, setGlobalName } from "layerr";

setGlobalName("CustomError");

const err = new Layerr("My error");

err.name; // "CustomError"

throw err;
// Uncaught Layerr [CustomError]: My error
```

## Support

Layerr (v3) supports NodeJS 16 onwards. It should also support all major+current browsers, once compiled/bundled.
