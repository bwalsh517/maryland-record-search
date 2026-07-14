const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupSeries, listSeries } = require("../../src/index.js");


test("CM1135-1, CM1135-51, CM1135-101 resolve to the exact given archive.org URLs", () => {
    assert.equal(
        lookupSeries("CM1135-1")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-001/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-001/"
    );

    assert.equal(
        lookupSeries("CM1135-51")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-051/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-051/"
    );

    assert.equal(
        lookupSeries("CM1135-101")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-101/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-101/"
    );
});


test("CM1135-150 is the last archive.org record, correctly in the 101-150 chunk", () => {
    assert.equal(
        lookupSeries("CM1135-150")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-101/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-150/"
    );
});


test("CM1135-151 through CM1135-670 resolve to the MSA guide URL pattern", () => {
    assert.equal(
        lookupSeries("CM1135-151")[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-151"
    );

    assert.equal(
        lookupSeries("CM1135-670")[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-670"
    );

    assert.equal(
        lookupSeries("CM1135-400")[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-400"
    );
});


test("CM1135 number 0 or past 670 returns no results", () => {
    assert.deepEqual(lookupSeries("CM1135-0"), []);
    assert.deepEqual(lookupSeries("CM1135-671"), []);
});


test("CM1135 only handles Baltimore City", () => {
    assert.ok(lookup({ location: "Talbot", month: 6, year: 1900, recordType: "birth" }).every(r => r.series !== "CM1135"));
});


test("CM1135 has no location/date search implemented - series-ID lookup only", () => {
    const results = lookup({ location: "Baltimore City", month: 6, year: 1900, recordType: "birth" });
    assert.ok(results.every(r => r.series !== "CM1135"));
});


test("listSeries() reports CM1135 with the year-only (month 0) date range", () => {
    const series = listSeries().find(s => s.name === "CM1135");

    assert.ok(series);
    assert.equal(series.recordType, "birth");
    assert.equal(series.supportsLocationSearch, false);
    assert.deepEqual(series.dateRange, { startYear: 1875, startMonth: 0, endYear: 1972, endMonth: 0 });
});


test("CM1135's dateRange (month 0 boundaries) correctly gates canHandle at both ends", () => {
    const cm1135 = require("../../src/series/cm1135.js");

    assert.equal(cm1135.canHandle("Baltimore City", 1, 1875), true);
    assert.equal(cm1135.canHandle("Baltimore City", 12, 1972), true);
    assert.equal(cm1135.canHandle("Baltimore City", 12, 1874), false);
    assert.equal(cm1135.canHandle("Baltimore City", 1, 1973), false);
});
