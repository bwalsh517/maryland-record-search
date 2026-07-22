const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, listSeries } = require("../../src/index.js");


test("S1963-23 is Allegany, Aug 1898 (first record of the regular rotation)", () => {
    const results = lookup({ location: "Allegany", month: 8, year: 1898, recordType: "birth" });
    assert.equal(results.length, 1);
    assert.equal(results[0].number, 23);
});


test("S1963-1 through S1963-22 resolve via the MSA guide, series-ID only", () => {
    assert.equal(
        lookup({ series: "S1963-1" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=S1963-1"
    );

    assert.equal(
        lookup({ series: "S1963-22" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=S1963-22"
    );
});


test("S1963-23, S1963-1001, S1963-3001 resolve to the exact given archive.org URLs", () => {
    assert.equal(
        lookup({ series: "S1963-23" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-0023/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-0023/"
    );

    assert.equal(
        lookup({ series: "S1963-1001" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-1001/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-1001/"
    );

    assert.equal(
        lookup({ series: "S1963-3001" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-3001/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-3001/"
    );
});


test("S1963-2001 uses its block's confirmed collection name, distinct from its own number", () => {
    assert.equal(
        lookup({ series: "S1963-2001" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-2346/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-2001/"
    );
});


test("records that aren't the first in their archive.org block keep the block's collection name", () => {
    // Regression test: archive.org files these in shared blocks, not
    // one item per record. A record partway through a block previously
    // got its own (wrong) collection name instead of the block's.
    assert.equal(
        lookup({ series: "S1963-24" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-0023/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-0024/"
    );

    assert.equal(
        lookup({ series: "S1963-1002" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-1001/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-1002/"
    );

    assert.equal(
        lookup({ series: "S1963-2002" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-2346/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-2002/"
    );

    assert.equal(
        lookup({ series: "S1963-3002" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-3001/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-3002/"
    );
});

test("no-file records return an informative result with a null url, via both series-ID and location/date search", () => {
    const noFileCases = [
        { number: 40, location: "Saint Mary's", month: 8, year: 1898 },
        { number: 41, location: "Somerset", month: 8, year: 1898 },
        { number: 45, location: "Worcester", month: 8, year: 1898 },
        { number: 64, location: "Somerset", month: 9, year: 1898 },
        { number: 68, location: "Worcester", month: 9, year: 1898 },
        { number: 111, location: "Talbot", month: 11, year: 1898 },
        { number: 114, location: "Worcester", month: 11, year: 1898 },
        { number: 852, location: "Anne Arundel", month: 8, year: 1901 },
        { number: 2662, location: "Saint Mary's", month: 2, year: 1908 },
        { number: 2915, location: "Saint Mary's", month: 1, year: 1909 },
        { number: 2961, location: "Saint Mary's", month: 3, year: 1909 }
    ];

    for (const testCase of noFileCases) {

        const viaSeries = lookup({ series: `S1963-${testCase.number}` });
        assert.equal(viaSeries.length, 1);
        assert.equal(viaSeries[0].url, null);
        assert.equal(viaSeries[0].label, "No cards are extant for this month and county");

        const viaLocation = lookup({
            location: testCase.location,
            month: testCase.month,
            year: testCase.year,
            recordType: "birth"
        });
        assert.equal(viaLocation.length, 1);
        assert.equal(viaLocation[0].number, testCase.number);
        assert.equal(viaLocation[0].url, null);
    }
});


test("the rotation continues normally right after a no-file record, without a gap or duplicate", () => {
    // St. Mary's (40) and Somerset (41) are both no-file for Aug 1898,
    // but Talbot (42) - the next distinct county after them in the
    // rotation - is a normal record.
    const results = lookup({ location: "Talbot", month: 8, year: 1898, recordType: "birth" });
    assert.equal(results.length, 1);
    assert.equal(results[0].number, 42);
    assert.notEqual(results[0].url, null);
});


test("S1963 does not handle Baltimore City or dates outside Aug 1898 - Apr 1910", () => {
    assert.ok(lookup({ location: "Baltimore City", month: 8, year: 1900, recordType: "birth" }).every(r => r.series !== "S1963"));
    assert.ok(lookup({ location: "Talbot", month: 5, year: 1910, recordType: "birth" }).every(r => r.series !== "S1963"));
});


test("S1963 series-ID lookup rejects numbers outside seriesIdRange", () => {
    assert.equal(lookup({ series: "S1963-0" }).length, 0);
    assert.equal(lookup({ series: "S1963-3265" }).length, 1);
    assert.equal(lookup({ series: "S1963-99999" }).length, 0);
});


test("listSeries() reports S1963 as a birth series with location search implemented", () => {
    const series = listSeries().find(s => s.name === "S1963");

    assert.ok(series);
    assert.equal(series.recordType, "birth");
    assert.equal(series.supportsLocationSearch, true);
    assert.deepEqual(series.seriesIdRange, { start: 1, end: 3265 });
});
