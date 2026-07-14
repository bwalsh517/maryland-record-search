const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { VERSION, REPOSITORY_URL } = require("../../src/index.js");
const packageJson = require(path.join("..", "..", "package.json"));


test("MDRecordSearch.VERSION matches package.json's version", () => {
    // There's no build step to inject the version automatically (the
    // browser has no access to package.json at all), so this is what
    // catches the two drifting apart if only one gets updated.
    assert.equal(VERSION, packageJson.version);
});


test("MDRecordSearch.REPOSITORY_URL matches package.json's repository.url", () => {
    const expected = packageJson.repository.url.replace(/\.git$/, "");
    assert.equal(REPOSITORY_URL, expected);
});
