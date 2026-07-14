const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupSeries } = require("../../src/index.js");


test("SE42-63 (first regular-rotation record) is Anne Arundel, Aug 1898", () => {
    const results = lookup({ location: "Anne Arundel", month: 8, year: 1898, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 63);
});


const leadingSpecials = [
    { location: "Baltimore", month: 5, year: 1898, expected: 22 },
    { location: "Talbot", month: 5, year: 1898, expected: 27 },
    { location: "Anne Arundel", month: 6, year: 1898, expected: 28 },
    { location: "Talbot", month: 6, year: 1898, expected: 41 },
    { location: "Anne Arundel", month: 7, year: 1898, expected: 42 },
    { location: "Calvert", month: 7, year: 1898, expected: 49 },
    { location: "Worcester", month: 7, year: 1898, expected: 62 }
];

for (const testCase of leadingSpecials) {
    test(`SE42 leading special: ${testCase.location} ${testCase.month}/${testCase.year} -> SE42-${testCase.expected}`, () => {
        const results = lookup({ ...testCase, recordType: "death" });
        assert.equal(results.length, 1);
        assert.equal(results[0].number, testCase.expected);
    });
}


test("SE42 records 1-21 are series-ID only (not indexed by location/date)", () => {
    // These predate even the leading-specials block and aren't broken
    // out by county/month yet.
    const results = lookupSeries("SE42-21");
    assert.equal(results.length, 1);
    assert.equal(results[0].location, null);
});


test("SE42 does not handle Baltimore City", () => {
    const results = lookup({ location: "Baltimore City", month: 8, year: 1898, recordType: "death" });
    assert.ok(results.every(r => r.series !== "SE42"));
});


test("SE42-3297 and SE42-3298 are the trailing Washington County special cases", () => {
    const may = lookup({ location: "Washington", month: 5, year: 1898, recordType: "death" });
    const june = lookup({ location: "Washington", month: 6, year: 1898, recordType: "death" });

    assert.equal(may[0].number, 3297);
    assert.equal(june[0].number, 3298);
});


test("SE42-345 series lookup resolves to a valid archive.org URL", () => {
    const results = lookupSeries("SE42-345");
    assert.ok(results[0].url.startsWith("https://archive.org/details/"));
});


test("SE42-3296 is Worcester, Apr 1910 (last record of the regular rotation)", () => {
    const results = lookup({ location: "Worcester", month: 4, year: 1910, recordType: "death" });
    assert.equal(results.length, 1);
    assert.equal(results[0].number, 3296);
});


const missingCombinations = [
    { location: "Calvert", month: 6, year: 1900 },
    { location: "Charles", month: 1, year: 1900 },
    { location: "Charles", month: 5, year: 1900 },
    { location: "Charles", month: 7, year: 1900 },
    { location: "Charles", month: 8, year: 1900 },
    { location: "Somerset", month: 12, year: 1900 },
    { location: "Saint Mary's", month: 5, year: 1901 },
    { location: "Saint Mary's", month: 6, year: 1901 },
    { location: "Talbot", month: 3, year: 1903 }
];

for (const combo of missingCombinations) {
    test(`SE42 has no record for ${combo.location} ${combo.month}/${combo.year} (known gap in the rotation)`, () => {
        assert.deepEqual(lookup({ ...combo, recordType: "death" }), []);
    });
}


test("SE42 rotation continues normally in the month right after a known gap", () => {
    // Regression guard: a gap should skip exactly one number, not
    // shift the whole month or duplicate the previous county's number.
    const results = lookup({ location: "Charles", month: 2, year: 1900, recordType: "death" });
    assert.equal(results.length, 1);
    assert.equal(results[0].number, 481);
});
