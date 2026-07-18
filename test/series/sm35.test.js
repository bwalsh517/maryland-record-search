const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupYear, lookupSeries, listSeries } = require("../../src/index.js");


test("SM35-1, SM35-36, SM35-72 resolve to the exact given archive.org URLs", () => {
    assert.equal(
        lookupSeries("SM35-1")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-1/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3116/"
    );

    assert.equal(
        lookupSeries("SM35-36")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-36/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3679/"
    );

    assert.equal(
        lookupSeries("SM35-72")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-72/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3715/"
    );
});


test("every SM35-1 through SM35-72 resolves to an archive.org URL", () => {
    for (let n = 1; n <= 72; n++) {
        const results = lookupSeries(`SM35-${n}`);
        assert.equal(results.length, 1, `SM35-${n} should resolve`);
        assert.ok(results[0].url.startsWith("https://archive.org/details/"));
    }
});


test("SM35-33's irregular sr value (3676-A) is preserved verbatim in the URL", () => {
    assert.equal(
        lookupSeries("SM35-33")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-33/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3676-A/"
    );
});


test("SM35-73 through SM35-269 resolve to the MSA guide URL pattern", () => {
    assert.equal(
        lookupSeries("SM35-73")[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=SM35-73"
    );

    assert.equal(
        lookupSeries("SM35-269")[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=SM35-269"
    );
});


test("SM35 number 0 or past 269 returns no results", () => {
    assert.deepEqual(lookupSeries("SM35-0"), []);
    assert.deepEqual(lookupSeries("SM35-270"), []);
});


test("location/date search returns every file for the matching year, regardless of county", () => {
    // Deliberately coarse - see the comment on lookupLocationMonthYear()
    // in src/series/sm35.js for why county/month aren't filtered.
    const forAnneArundel = lookup({ location: "Anne Arundel", month: 6, year: 1914, recordType: "birth" });
    const forWorcester = lookup({ location: "Worcester", month: 11, year: 1914, recordType: "birth" });

    assert.equal(forAnneArundel.length, 8);
    assert.deepEqual(forAnneArundel, forWorcester);
});


test("each year-search result carries the finding aid's own description as its label", () => {
    const results = lookup({ location: "Talbot", month: 1, year: 1914, recordType: "birth" });
    const first = results.find(r => r.number === 1);

    assert.equal(first.label, "Jan. AL-QA, WA-WO, QA-WA, Feb. AL-BA");
});


test("lookupYear() only queries SM35 once per year, not once per month", () => {
    const results = lookupYear({ location: "Talbot", year: 1918, recordType: "birth" });
    assert.equal(results.length, 8);
});


test("1923-1951 has full year-level location search, resolving through the MSA guide", () => {
    const results = lookup({ location: "Talbot", month: 6, year: 1930, recordType: "birth" });

    assert.equal(results.length, 7);
    assert.ok(results.some(r => r.number === 124 && r.label === "Jan. AL-WO, Feb. AL-MO"));

    // URLs for this range use the MSA guide pattern, not archive.org,
    // regardless of having sr values in RECORDS.
    assert.ok(results.every(r => r.url.startsWith("https://guide.msa.maryland.gov/")));
});


test("the last record in the series (SM35-269, 1951) resolves correctly through year search", () => {
    const results = lookup({ location: "Talbot", year: 1951, recordType: "birth" });
    const last = results.find(r => r.number === 269);

    assert.ok(last);
    assert.equal(last.label, "Jun. MO-WO");
    assert.equal(last.url, "https://guide.msa.maryland.gov/pages/item.aspx?ID=SM35-269");
});


test("a year genuinely outside the series (1952) returns no results", () => {
    assert.deepEqual(lookup({ location: "Talbot", month: 6, year: 1952, recordType: "birth" }), []);
});


test("SM35 does not handle Baltimore City or dates outside 1914-1951", () => {
    // Baltimore City birth records for this date are legitimately
    // covered by CM1135 - check SM35 specifically isn't in the
    // results, rather than asserting the whole result set is empty.
    assert.ok(
        lookup({ location: "Baltimore City", month: 6, year: 1918, recordType: "birth" })
            .every(r => r.series !== "SM35")
    );

    // 1913 is outside SM35's range but legitimately covered by S1988,
    // and years past 1951 have no birth series at all yet - check SM35
    // specifically isn't in the results, rather than asserting the
    // whole result set is empty.
    assert.ok(lookup({ location: "Talbot", month: 6, year: 1913, recordType: "birth" }).every(r => r.series !== "SM35"));
    assert.ok(lookup({ location: "Talbot", month: 6, year: 1952, recordType: "birth" }).every(r => r.series !== "SM35"));
});


test("listSeries() reports SM35 as a birth series with location search implemented", () => {
    const series = listSeries().find(s => s.name === "SM35");

    assert.ok(series);
    assert.equal(series.recordType, "birth");
    assert.equal(series.supportsLocationSearch, true);
});
