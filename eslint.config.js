"use strict";

const js = require("@eslint/js");

// Every file in src/ (and scripts/release.js) can run as a plain
// browser <script> or via Node's require() - see the guarded
// `typeof require !== "undefined"` pattern throughout src/. Both
// sets of globals are declared here so neither environment's usage
// looks like an undeclared variable to ESLint.
const projectGlobals = {
    window: "readonly",
    document: "readonly",
    globalThis: "readonly",

    require: "readonly",
    module: "writable",
    process: "readonly",
    console: "readonly",
    __dirname: "readonly",
    __filename: "readonly"
};

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: projectGlobals
        },
        rules: {
            // A leading underscore signals an intentionally-unused
            // parameter (e.g. a base-class stub method's signature,
            // kept for documentation even though this implementation
            // doesn't use it) rather than a mistake.
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
        }
    },
    {
        // MDRecordSearch is the library's own global, set up by the
        // <script> tags loaded before app.js runs - not defined
        // anywhere in this file itself.
        files: ["examples/**/*.js"],
        languageOptions: {
            globals: {
                MDRecordSearch: "readonly"
            }
        }
    },
    {
        ignores: ["node_modules/**"]
    }
];
