const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupSeries, listSeries } = require("../../src/index.js");


test("SE44-1 (first record) is Allegany, Jul 1951", () => {
    const results = lookup({ location: "Allegany", month: 7, year: 1951, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 1);
});


test("SE44-5021 (last record) is Worcester, Jun 1969", () => {
    const results = lookup({ location: "Worcester", month: 6, year: 1969, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 5021);
});


test("SE44 does not handle Baltimore City", () => {
    const results = lookup({ location: "Baltimore City", month: 7, year: 1951, recordType: "death" });
    assert.ok(results.every(r => r.series !== "SE44"));
});


test("SE44 handles a Montgomery split exception (Dec 1954) as two records", () => {
    const results = lookup({ location: "Montgomery", month: 12, year: 1954, recordType: "death" });

    assert.equal(results.length, 2);
    assert.deepEqual(results.map(r => r.label).sort(), ["A-J", "K-Z"].sort());
});


test("SE44 handles a three-way split month (Jan 1969: Baltimore, Prince George's, and Saint Mary's all split)", () => {
    const baltimore = lookup({ location: "Baltimore", month: 1, year: 1969, recordType: "death" });
    const princeGeorges = lookup({ location: "Prince George's", month: 1, year: 1969, recordType: "death" });

    assert.equal(baltimore.length, 2);
    assert.deepEqual(baltimore.map(r => r.label).sort(), ["A-K", "L-Z"].sort());

    assert.equal(princeGeorges.length, 2);
    assert.deepEqual(princeGeorges.map(r => r.label).sort(), ["A-C", "D-Z"].sort());
});


test("Saint Mary's Jan 1969 still consumes two record numbers even though the second half has no file", () => {
    // Data quirk: MONTH_EXCEPTION_SPLITS lists ["", "No File"] for this
    // key. The number is still allocated in the sequence (so later
    // counties that month don't shift), but the second record's own
    // label documents that nothing was actually filed there.
    const results = lookup({ location: "Saint Mary's", month: 1, year: 1969, recordType: "death" });

    assert.equal(results.length, 2);
    assert.deepEqual(results.map(r => r.label), ["", "No File"]);
    assert.equal(results[1].number, results[0].number + 1);
});


test("SE44's computed archiveUrl blocks records in chunks of 1000", () => {
    assert.equal(
        lookupSeries("SE44-1")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-44-000001/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se44_000001/"
    );

    assert.equal(
        lookupSeries("SE44-999")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-44-000001/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se44_000999/"
    );

    // 1000 is the last number of the first block, not the first of the second.
    assert.equal(
        lookupSeries("SE44-1000")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-44-000001/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se44_001000/"
    );

    assert.equal(
        lookupSeries("SE44-1001")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-44-001001/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se44_001001/"
    );
});


test("SE44-5021's URL falls in the 5001 block, matching the last generated record", () => {
    assert.equal(
        lookupSeries("SE44-5021")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-44-005001/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se44_005021/"
    );
});

// SE44 overrides archiveUrl() directly with a computed formula, unlike
// the table-based series (ARCHIVE_RANGES + findArchiveRange()), so it
// has no bound of its own - seriesIdRange is what actually rejects a
// number the series never generated (0, or anything past 5021).
test("SE44 series-ID lookup rejects numbers outside seriesIdRange", () => {
    assert.equal(lookupSeries("SE44-0").length, 0);
    assert.equal(lookupSeries("SE44-1").length, 1);
    assert.equal(lookupSeries("SE44-5021").length, 1);
    assert.equal(lookupSeries("SE44-99999").length, 0);
});


test("listSeries() reports SE44 with its full date range and location search implemented", () => {
    const series = listSeries().find(s => s.name === "SE44");

    assert.ok(series);
    assert.equal(series.recordType, "death");
    assert.equal(series.supportsLocationSearch, true);
    assert.deepEqual(series.dateRange, { startYear: 1951, startMonth: 7, endYear: 1969, endMonth: 6 });
});


test("SE44 has no record for a county/month combination outside its indexed data (e.g. Baltimore City routed elsewhere)", () => {
    // Exercises the lookupLocationMonthYear() branch where the index
    // simply has no entry for the given key.
    const se44 = require("../../src/series/se44.js");
    assert.deepEqual(se44.lookupLocationMonthYear("Allegany", 1, 2000), []);
});


test("SE44's dateRange correctly gates canHandle at both ends", () => {
    const se44 = require("../../src/series/se44.js");

    assert.equal(se44.canHandle("Allegany", 7, 1951), true);
    assert.equal(se44.canHandle("Worcester", 6, 1969), true);
    assert.equal(se44.canHandle("Allegany", 6, 1951), false);
    assert.equal(se44.canHandle("Worcester", 7, 1969), false);
});
