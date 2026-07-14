const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupSeries } = require("../../src/index.js");


const locationDateCases = [
    { name: "first SE43 file", location: "Anne Arundel", month: 5, year: 1910, expected: 1 },
    { name: "last file before yearly block", location: "Worcester", month: 12, year: 1923, expected: 3774 },
    { name: "first yearly block file", location: "Worcester", month: 1, year: 1924, expected: 3807 },
    { name: "Worcester Dec 1924 yearly file", location: "Worcester", month: 12, year: 1924, expected: 3807 },
    { name: "Allegany Jan 1931 restart", location: "Allegany", month: 1, year: 1931, expected: 4021 },
    { name: "Carroll Jun 1940", location: "Carroll", month: 6, year: 1940, expected: 6625 },
    { name: "Garrett 1928 special file", location: "Garrett", month: 10, year: 1928, expected: 9679 }
];

for (const testCase of locationDateCases) {
    test(`SE43 location/date: ${testCase.name}`, () => {
        const results = lookup({
            location: testCase.location,
            month: testCase.month,
            year: testCase.year
        });

        assert.equal(results.length > 0, true, "expected at least one result");
        assert.equal(results[0].number, testCase.expected);
    });
}


test("SE43-345 series lookup resolves to the correct archive.org URL", () => {
    const results = lookupSeries("SE43-345");

    assert.equal(
        results[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-1910-1921-msa-se-43-001-736/Reclaim_The_Records_-_Maryland_Death_Certificates_1910-1921_-_msa_se43_-_00345/"
    );
});


test("SE43 does not handle Baltimore City (that routes to the CM1132/CE502 series instead)", () => {
    const results = lookup({ location: "Baltimore City", month: 5, year: 1920 });
    assert.ok(
        results.every(r => r.series !== "SE43"),
        "SE43 should never appear in Baltimore City results"
    );
});
