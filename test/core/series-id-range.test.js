const test = require("node:test");
const assert = require("node:assert/strict");

const { SERIES, listSeries } = require("../../src/index.js");
const SE46_DATA = require("../../src/series/se46-data.js");

/**
 * Every series' seriesIdRange.end is a hand-declared fixed value (see
 * v2-extensibility-framework.md discussion). This file checks it
 * against whatever the series' own logic actually produces, so a typo
 * in the fixed value (the SE45 ARCHIVE_RANGES bug's shape exactly)
 * fails a test instead of silently drifting.
 *
 * Two ways a series' real upper bound is derived, depending on
 * whether it builds a location/date index or not:
 *
 *  - buildIndex()-based series: walk this.index and take the max of
 *    the "number" field every series' pushed records use.
 *
 *  - series-ID-only series (no buildIndex): there's no index to walk,
 *    so the real bound is whatever ARCHIVE_RANGES already declares
 *    (CE502, CM1132), or is confirmed directly against archiveUrl()'s
 *    actual resolve/no-resolve boundary (CM1135, which has no
 *    ARCHIVE_RANGES entry covering its full range - see below).
 */
function maxFromIndex(series) {

    let max = -Infinity;

    for (const key of Object.keys(series.index)) {
        for (const record of series.index[key]) {
            if (record.number > max) {
                max = record.number;
            }
        }
    }

    return max;
}


for (const series of SERIES) {

    test(`${series.name} declares a seriesIdRange`, () => {
        assert.ok(series.seriesIdRange, `${series.name} has no seriesIdRange`);
        assert.equal(series.seriesIdRange.start, 1);
        assert.ok(series.seriesIdRange.end > 0);
    });
}


test("SE42 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "SE42");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("SE43 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "SE43");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("SE44 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "SE44");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("SE45 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "SE45");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("SE46 seriesIdRange.end matches YEAR_METADATA's declared last number for 2014", () => {
    const series = SERIES.find(s => s.name === "SE46");
    assert.equal(series.seriesIdRange.end, SE46_DATA.YEAR_METADATA[2014].lastNumber);
});


test("S1988 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "S1988");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("SM35 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "SM35");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("S1963 seriesIdRange.end matches its computed index", () => {
    const series = SERIES.find(s => s.name === "S1963");
    assert.equal(series.seriesIdRange.end, maxFromIndex(series));
});


test("CE502 seriesIdRange.end matches its ARCHIVE_RANGES table (no buildIndex to cross-check against)", () => {
    const series = SERIES.find(s => s.name === "CE502");
    const lastRange = series.ARCHIVE_RANGES[series.ARCHIVE_RANGES.length - 1];
    assert.equal(series.seriesIdRange.end, lastRange.end);
});


test("CM1132 seriesIdRange.end matches its ARCHIVE_RANGES table (no buildIndex to cross-check against)", () => {
    const series = SERIES.find(s => s.name === "CM1132");
    const lastRange = series.ARCHIVE_RANGES[series.ARCHIVE_RANGES.length - 1];
    assert.equal(series.seriesIdRange.end, lastRange.end);
});


test("CM1135's seriesIdRange.end is where archiveUrl() actually stops resolving", () => {
    const series = SERIES.find(s => s.name === "CM1135");
    assert.ok(series.archiveUrl(series.seriesIdRange.end), "last valid number should still resolve");
    assert.equal(series.archiveUrl(series.seriesIdRange.end + 1), null, "one past the end should not");
});


test("listSeries() reports seriesIdRange for every registered series", () => {
    for (const series of listSeries()) {
        assert.ok(series.seriesIdRange, `${series.name} missing seriesIdRange in listSeries()`);
    }
});
