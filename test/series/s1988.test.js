const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, listSeries } = require("../../src/index.js");


test("S1988-1, S1988-501, S1988-1000 resolve to the exact given archive.org URLs", () => {
    assert.equal(
        lookup({ series: "S1988-1" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1910-1913-s-1988-1/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1910-1913_-_S1988-001/"
    );

    assert.equal(
        lookup({ series: "S1988-501" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1910-1913-s-1988-501/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1910-1913_-_S1988-501/"
    );

    assert.equal(
        lookup({ series: "S1988-1000" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1910-1913-s-1988-1000/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1910-1913_-_S1988-1000/"
    );
});


test("S1988-1 is Allegany, May 1910 (first record, alphabetical county order)", () => {
    const results = lookup({ location: "Allegany", month: 5, year: 1910, recordType: "birth" });
    assert.equal(results.length, 1);
    assert.equal(results[0].number, 1);
});


test("S1988 is registered as a birth series and is filterable separately from death series", () => {
    const deathResults = lookup({ location: "Anne Arundel", month: 5, year: 1911, recordType: "death" });
    const birthResults = lookup({ location: "Anne Arundel", month: 5, year: 1911, recordType: "birth" });

    assert.ok(deathResults.every(r => r.seriesType === "death"));
    assert.ok(birthResults.every(r => r.seriesType === "birth"));
    assert.ok(birthResults.some(r => r.series === "S1988"));
});


test("S1988 does not handle Baltimore City", () => {
    // Baltimore City birth records for this date are legitimately
    // covered by CM1135 - check S1988 specifically isn't in the
    // results, rather than asserting the whole result set is empty.
    const results = lookup({ location: "Baltimore City", month: 5, year: 1911, recordType: "birth" });
    assert.ok(results.every(r => r.series !== "S1988"));
});


test("S1988 does not handle dates outside May 1910 - Dec 1913", () => {
    assert.ok(lookup({ location: "Anne Arundel", month: 1, year: 1910, recordType: "birth" }).every(r => r.series !== "S1988"));

    // Jan 1914 is outside S1988's range, but is now legitimately covered
    // by SM35 - so check S1988 specifically isn't in the results,
    // rather than asserting the whole result set is empty.
    assert.ok(lookup({ location: "Anne Arundel", month: 1, year: 1914, recordType: "birth" }).every(r => r.series !== "S1988"));
});


test("listSeries() reports S1988 as a birth series with location search implemented", () => {
    const series = listSeries().find(s => s.name === "S1988");

    assert.ok(series);
    assert.equal(series.recordType, "birth");
    assert.equal(series.supportsLocationSearch, true);
});


// NOT YET CONFIRMED: the end of the final archive.org range (currently
// a provisional estimate of 1012, based on 44 months x 23 counties with
// no assumed gaps) - see the TODO in src/series/s1988.js. Once the real
// final item/count is known, add a test here anchoring the last record
// the same way SE42/SE43 anchor their last grid entries.
