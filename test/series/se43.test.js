const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupSeries } = require("../../src/index.js");


const locationDateCases = [
    { name: "Begin 1st order Anne Arundel May 1910", location: "Anne Arundel", month: 5, year: 1910, expected: 1 },
    { name: "Begin 1st order Calvert May 1910", location: "Calvert", month: 5, year: 1910, expected: 8 },
    { name: "End 1st order: Allegany Dec 1915", location: "Allegany", month: 12, year: 1915, expected: 1543 },
    { name: "End 1st order: Calvert Dec 1915", location: "Calvert", month: 12, year: 1915, expected: 1549 },
    { name: "Begin 2nd order: Allegany Jan 1916", location: "Allegany", month: 1, year: 1916, expected: 1565 },
    { name: "Begin 2nd order: Calvert Jan 1916", location: "Calvert", month: 1, year: 1916, expected: 1568 },
    { name: "End 2nd order: Allegany Dec 1944", location: "Allegany", month: 12, year: 1944, expected: 7862 },
    { name: "End 2nd order: Calvert Dec 1944", location: "Calvert", month: 12, year: 1944, expected: 7865 },
    { name: "Begin 3rd order: Allegany Jan 1945", location: "Allegany", month: 1, year: 1945, expected: 7886 },
    { name: "Begin 3rd order: Calvert Jan 1945", location: "Calvert", month: 1, year: 1945, expected: 7892 },
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
