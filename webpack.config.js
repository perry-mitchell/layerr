const path = require("node:path");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

module.exports = {
    devtool: false,

    entry: path.resolve(__dirname, "./source/index.ts"),

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"]
                    }
                },
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },

    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: {
            type: "commonjs2"
        }
    },

    resolve: {
        extensions: [".js"],
        fallback: {
            buffer: false,
            crypto: false,
            fs: false,
            net: false,
            process: false,
            stream: false,
            util: false
        },
        plugins: [
            new ResolveTypeScriptPlugin()
        ]
    },

    target: "node"
};
