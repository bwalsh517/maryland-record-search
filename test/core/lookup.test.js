const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, listSeries } = require("../../src/index.js");


test("lookup() with no matching options returns an empty array", () => {
    assert.deepEqual(lookup({}), []);
});


test("lookup() never throws on an unrecognized location", () => {
    assert.doesNotThrow(() => {
        const results = lookup({ location: "Not A Real County", month: 5, year: 1920 });
        assert.deepEqual(results, []);
    });
});


test("lookup() never throws on a garbage series ID", () => {
    assert.doesNotThrow(() => {
        assert.deepEqual(lookup({ series: "???" }), []);
    });
});


test("lookup({ series }) matches series names exactly, not by prefix", () => {
    // SE43 and SE45 share the prefix "SE4"; a naive startsWith() match
    // could misroute one to the other's regex, silently returning no
    // results for a well-formed ID.
    const se43Result = lookup({ series: "SE43-1" });
    const se45Result = lookup({ series: "SE45-1" });

    assert.equal(se43Result[0].series, "SE43");
    assert.equal(se45Result[0].series, "SE45");
});


test("lookup({ series }) returns an empty array for an ID with no matching series", () => {
    assert.deepEqual(lookup({ series: "ZZ99-1" }), []);
});


test("lookup({ series }) returns an empty array for an ID with no dash", () => {
    assert.deepEqual(lookup({ series: "SE43" }), []);
});


test("a series with no location/date search implemented returns no results, not a placeholder", () => {
    // 2020 is past every series' coverage (SE46, the last one, ends
    // 2014) - year 2000 used to work for this test, but SE46 now
    // legitimately covers it via its year-only fallback for 1988-2014.
    const results = lookup({ location: "Talbot", month: 1, year: 2020 });
    assert.deepEqual(results, []);

    const yearResults = lookup({ location: "Talbot", year: 2020 });
    assert.deepEqual(yearResults, []);
});


test("listSeries() reports every registered series with its record type", () => {
    const series = listSeries();

    assert.ok(series.length >= 8);
    assert.ok(series.every(s => s.recordType === "death" || s.recordType === "birth"));
    assert.ok(series.some(s => s.recordType === "death"));
    assert.ok(series.some(s => s.recordType === "birth"));
    assert.ok(series.some(s => s.name === "SE43" && s.supportsLocationSearch === true));
    assert.ok(series.some(s => s.name === "SE46" && s.supportsLocationSearch === true));
});


test("listSeries() reports an accurate dateRange for every series, matching what canHandle() actually does", () => {
    const series = listSeries();

    // SE46 is the one deliberate exception: its dateRange (1973-2014)
    // is the series' true, honest span, but location search is only
    // implemented for a portion of it so far (see se46-data.js) -
    // narrowing dateRange to match would misrepresent what the series
    // actually covers, so the invariant below doesn't hold for it.
    const EXEMPT = new Set(["SE46"]);

    for (const s of series) {
        assert.ok(s.dateRange, `${s.name} should have a dateRange`);

        if (EXEMPT.has(s.name)) {
            continue;
        }

        const { startYear, startMonth, endYear, endMonth } = s.dateRange;

        // The declared range's own start/end must themselves pass
        // canHandle() for a real county - proves dateRange isn't just
        // reported data, it's the same thing driving actual filtering.
        // Checked against both a normal county and Baltimore City
        // rather than hardcoding which series requires which, so this
        // doesn't need updating every time a new series is added.
        const seriesInstance = require("../../src/series/" + s.name.toLowerCase() + ".js");

        const startOk =
            seriesInstance.canHandle("Talbot", startMonth, startYear) ||
            seriesInstance.canHandle("Baltimore City", startMonth, startYear);

        const endOk =
            seriesInstance.canHandle("Talbot", endMonth, endYear) ||
            seriesInstance.canHandle("Baltimore City", endMonth, endYear);

        assert.equal(startOk, true, `${s.name} canHandle() should accept its own dateRange start`);
        assert.equal(endOk, true, `${s.name} canHandle() should accept its own dateRange end`);
    }
});


test("lookup() with location + year (month omitted) collapses a year-filed record to a single result instead of 12 duplicates", () => {
    // Worcester 1924 is filed as one file covering the whole year in
    // SE43's index (the same record repeats under every month key
    // internally) - the year-only path should dedupe that down to one
    // entry. Filtered to death records specifically, since SM35 (birth)
    // now also covers 1924 for every county via its own year-level
    // search.
    const results = lookup({ location: "Worcester", year: 1924, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].series, "SE43");
    assert.equal(results[0].number, 3807);
    assert.equal(results[0].month, null);
});


test("lookup() with location + year (month omitted) returns one entry per month for a monthly-filed county, in month order", () => {
    const results = lookup({ location: "Anne Arundel", year: 1969 });

    assert.equal(results.length, 12);
    assert.deepEqual(results.map(r => r.month), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});


test("lookup() with location + year (month omitted) correctly spans a mid-year series transition (SE44 -> SE45 in 1969)", () => {
    const results = lookup({ location: "Anne Arundel", year: 1969 });

    const seriesByMonth = Object.fromEntries(results.map(r => [r.month, r.series]));

    assert.equal(seriesByMonth[6], "SE44");
    assert.equal(seriesByMonth[7], "SE45");
});


test("lookup() with year but no location returns an empty array", () => {
    assert.deepEqual(lookup({ year: 1969 }), []);
});


test("lookup() never throws on an unrecognized location (year-only search)", () => {
    assert.doesNotThrow(() => {
        assert.deepEqual(lookup({ location: "Not A Real County", year: 1969 }), []);
    });
});


test("lookup() with a numeric county code produces the exact same results as the matching county name", () => {
    const byCode = lookup({ location: 3, month: 5, year: 1910, recordType: "death" });
    const byName = lookup({ location: "Baltimore", month: 5, year: 1910, recordType: "death" });

    assert.ok(byCode.length > 0);
    assert.deepEqual(byCode, byName);
});


test("lookup() with numeric code 30 routes the same way the literal 'Baltimore City' string does", () => {
    const byCode = lookup({ location: 30, month: 6, year: 1920, recordType: "death" });
    const byName = lookup({ location: "Baltimore City", month: 6, year: 1920, recordType: "death" });

    assert.deepEqual(byCode, byName);
});


test("lookup() with certificateNumber + a separate year field combines them when no prefix is embedded", () => {
    // A50000 is ambiguous on its own - CM1135's "A" letter block cycles
    // twice (1893 and 1909, see cm1135.test.js) - so this also proves
    // the separate year field actually narrows the search, not just
    // that it's accepted.
    const viaSeparateYear = lookup({ certificateNumber: "A50000", year: 1893, recordType: "birth" });
    const viaEmbeddedPrefix = lookup({ certificateNumber: "1893-A50000", recordType: "birth" });

    assert.deepEqual(viaSeparateYear.map(r => r.number), [37]);
    assert.deepEqual(viaSeparateYear, viaEmbeddedPrefix);
});


test("lookup() with certificateNumber + a separate year field prefers the embedded prefix when both are present and agree", () => {
    const results = lookup({ certificateNumber: "1893-A50000", year: 1893, recordType: "birth" });
    assert.deepEqual(results.map(r => r.number), [37]);
});


test("lookup() with certificateNumber + a separate year field returns an empty array when they disagree", () => {
    assert.deepEqual(
        lookup({ certificateNumber: "1893-A50000", year: 1909, recordType: "birth" }),
        []
    );
});
