const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupSeries } = require("../../src/index.js");


test("SE45-1 (first record) is Allegany, Jul 1969", () => {
    const results = lookup({ location: "Allegany", month: 7, year: 1969, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 1);
});


test("SE45-1037 (last record) is Worcester, Dec 1972", () => {
    const results = lookup({ location: "Worcester", month: 12, year: 1972, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 1037);
});


test("SE45 does not handle Baltimore City", () => {
    const results = lookup({ location: "Baltimore City", month: 7, year: 1969, recordType: "death" });
    assert.ok(results.every(r => r.series !== "SE45"));
});


test("SE45-1037 series lookup resolves to a valid archive.org URL", () => {
    const results = lookupSeries("SE45-1037");

    assert.equal(results.length, 1);
    assert.ok(results[0].url.startsWith("https://archive.org/details/"));
});


// Regression guard for the ARCHIVE_RANGES boundary bug: the range's
// `end` was mistakenly set to 7031 (a number that belongs to SE46's
// data, not SE45's) instead of 1037, SE45's actual highest record.
// That let series-ID lookups for numbers past the real end of the
// series (1038 through 7031) silently resolve to a URL for a file
// that doesn't exist, instead of correctly returning no results.
test("SE45-1038 (one past the real end of the series) returns no results", () => {
    assert.deepEqual(lookupSeries("SE45-1038"), []);
});


test("SE45-7031 (the old, incorrect end-of-range value) returns no results", () => {
    assert.deepEqual(lookupSeries("SE45-7031"), []);
});


test("SE45 index only ever produces record numbers within 1-1037", () => {
    // Broader regression guard: if a future data change pushes the
    // generated index past the real end of the series again, this
    // catches it even if the specific boundary numbers above change.
    // lookup() aggregates across every series active for a date, so
    // results are filtered down to SE45's own entries first.
    const allNumbers = [];

    for (const county of ["Allegany", "Worcester", "Baltimore", "Montgomery"]) {
        for (let year = 1969; year <= 1972; year++) {
            for (let month = 1; month <= 12; month++) {
                const results = lookup({ location: county, month, year, recordType: "death" })
                    .filter(r => r.series === "SE45");

                for (const result of results) {
                    allNumbers.push(result.number);
                }
            }
        }
    }

    assert.ok(allNumbers.length > 0, "sanity check: the search itself found SE45 records");
    assert.ok(allNumbers.every(n => n >= 1 && n <= 1037));
});


test("SE45 handles the mid-year split exception (Baltimore, Nov 1969) as two records", () => {
    const results = lookup({ location: "Baltimore", month: 11, year: 1969, recordType: "death" });

    assert.equal(results.length, 2);
    assert.deepEqual(results.map(r => r.label).sort(), ["A-V", "N-Z"].sort());
});


const missingBeforeSeriesStart = [
    { location: "Allegany", month: 6, year: 1969 },
    { location: "Worcester", month: 1, year: 1969 }
];

for (const combo of missingBeforeSeriesStart) {
    test(`SE45 itself has no record for ${combo.location} ${combo.month}/${combo.year} (before the series' indexed start)`, () => {
        // SE44 is still active for these dates, so lookup() legitimately
        // returns results from that series - this checks SE45 specifically
        // contributes nothing, not that the combined result is empty.
        const results = lookup({ ...combo, recordType: "death" }).filter(r => r.series === "SE45");
        assert.deepEqual(results, []);
    });
}
