const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupYear, lookupSeries, lookupCertificate, listSeries } = require("../../src/index.js");


test("CM1132-30 and CM1132-31 resolve to the correct archive.org URLs", () => {
    assert.equal(
        lookupSeries("CM1132-30")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00001-30/Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_00030/"
    );

    assert.equal(
        lookupSeries("CM1132-31")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-0031"
    );
});


test("date search returns a single record for a non-boundary month", () => {
    const results = lookup({ location: "Baltimore City", month: 1, year: 1875, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 1);
    assert.equal(results[0].label, "12/1874-05/1875 Nos. 1-2830");
});


test("date search returns BOTH overlapping records for a boundary month, rather than guessing", () => {
    // Record 1 ends 05/1875, record 2 starts 05/1875 - deliberately
    // overlapping by one month, same as a surname-split month in the
    // other series. Both are genuinely possible, so both come back.
    const results = lookup({ location: "Baltimore City", month: 5, year: 1875, recordType: "death" });

    assert.equal(results.length, 2);
    assert.deepEqual(results.map(r => r.number).sort(), [1, 2]);
});


test("a record's label leads with its actual date span, not just the certificate range", () => {
    // CM1132-118 covers Jan-Apr 1914 - a single January search should
    // make that span visible immediately, not just say "here's a
    // certificate range" with no hint it also covers Feb/Mar/Apr.
    const results = lookup({ location: "Baltimore City", month: 1, year: 1914, recordType: "death" });
    const r118 = results.find(r => r.number === 118);

    assert.ok(r118);
    assert.equal(r118.label, "01/1914-04/1914 Nos. C71526-C74735");
});


test("lookupYear() shows a multi-month record exactly once, not once per month it covers", () => {
    // CM1132-118 (Jan-Apr) is found independently by each month's
    // query, since it doesn't span the whole year and the whole-year
    // month:null shortcut doesn't apply - dedup by (series, number)
    // is what keeps it to a single result.
    const results = lookupYear({ location: "Baltimore City", year: 1914, recordType: "death" });
    const numbers = results.map(r => r.number);

    assert.equal(numbers.length, new Set(numbers).size, "no duplicate record numbers");
    assert.deepEqual(numbers, [117, 118, 119, 120, 121]);
});


test("date search correctly handles a record with only a single month (CM1132-134, no date range given)", () => {
    const results = lookup({ location: "Baltimore City", month: 10, year: 1918, recordType: "death" });

    assert.ok(results.some(r => r.number === 134));
});


test("date search shows a distinct label for a record with a date but no certificate range of its own (CM1132-60)", () => {
    const results = lookup({ location: "Baltimore City", month: 2, year: 1897, recordType: "death" });

    const r59 = results.find(r => r.number === 59);
    const r60 = results.find(r => r.number === 60);

    assert.ok(r59);
    assert.equal(r59.label, "11/1896-04/1897 Nos. A92251-A95675");

    assert.ok(r60);
    assert.equal(r60.label, "11/1896-04/1897 No distinct certificate range for this unit");
    assert.ok(r60.url); // still resolves a real archive.org URL
});


test("lookupCertificate() resolves the exact given page-jump example", () => {
    const results = lookupCertificate("B100000", { recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 94);
    assert.equal(results[0].label, "Nos. B99667-C2499");
    assert.equal(
        results[0].approximatePageUrl,
        "https://archive.org/details/reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00091-100/Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_00094/page/n333/mode/1up"
    );
});


test("lookupCertificate() results carry location: Baltimore City, same as location/date search results", () => {
    const results = lookupCertificate("B100000", { recordType: "death" });

    assert.equal(results[0].location, "Baltimore City");
});


test("lookupCertificate() accepts an optional YYYY- year prefix, matching CM1135's format", () => {
    // Plain lookup, no year - unaffected.
    const plain = lookupCertificate("A10295", { recordType: "death" });
    assert.equal(plain.length, 1);
    assert.equal(plain[0].number, 34);

    // A correct year prefix behaves identically to no prefix at all.
    const correctYear = lookupCertificate("1888-A10295", { recordType: "death" });
    assert.deepEqual(correctYear, plain);

    // A year that doesn't match the record's actual date returns
    // nothing, rather than either ignoring the year or throwing.
    assert.deepEqual(lookupCertificate("1950-A10295", { recordType: "death" }), []);

    // The old letter-dash style ("A-1234") still works, with or
    // without a year prefix in front of it.
    assert.deepEqual(
        lookupCertificate("A-10295", { recordType: "death" }).map(r => r.number),
        [34]
    );
    assert.deepEqual(
        lookupCertificate("1888-A-10295", { recordType: "death" }).map(r => r.number),
        [34]
    );
});


test("lookupCertificate() handles the unlettered block", () => {
    const results = lookupCertificate("500", { recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 1);
    assert.equal(results[0].certificateNumber, "500");
});


test("lookupCertificate() is case-insensitive on the letter prefix", () => {
    const upper = lookupCertificate("B100000", { recordType: "death" });
    const lower = lookupCertificate("b100000", { recordType: "death" });

    assert.deepEqual(upper, lower);
});


test("lookupCertificate() correctly returns nothing for a number in a genuine inter-record gap", () => {
    // Record 15 ends at 48500, record 16 starts at 48507 - a real gap
    // of 6 numbers, not an artifact of parsing.
    assert.deepEqual(lookupCertificate("48503", { recordType: "death" }), []);
});


test("lookupCertificate() rejects an invalid block letter and unparseable input", () => {
    assert.deepEqual(lookupCertificate("H500", { recordType: "death" }), []);
    assert.deepEqual(lookupCertificate("nonsense", { recordType: "death" }), []);
    assert.deepEqual(lookupCertificate("", { recordType: "death" }), []);
});


test("lookupCertificate() correctly handles a range that crosses a letter block boundary (CM1132-31)", () => {
    // Nos. 98451-A1974 - starts unlettered, ends in the A block.
    const beforeCrossover = lookupCertificate("99000", { recordType: "death" });
    const afterCrossover = lookupCertificate("A1000", { recordType: "death" });

    assert.equal(beforeCrossover[0].number, 31);
    assert.equal(afterCrossover[0].number, 31);
});


test("CM1132-244 is the confirmed unused/skipped record - informative result, no URL", () => {
    const results = lookupSeries("CM1132-244");

    assert.equal(results.length, 1);
    assert.equal(results[0].url, null);
    assert.equal(results[0].label, "Not used - previously a duplicate entry");
});


test("CM1132-244 does not appear in date search results (it has no date)", () => {
    // Its neighbors (243, 245) are both real dated records - confirm
    // 244 itself never shows up regardless of what month is queried.
    for (let month = 1; month <= 12; month++) {
        const results = lookupYear({ location: "Baltimore City", year: 1948, recordType: "death" });
        assert.ok(results.every(r => r.number !== 244));
    }
});


test("listSeries() reports CM1132 with both location and certificate-number search", () => {
    const series = listSeries().find(s => s.name === "CM1132");

    assert.ok(series);
    assert.equal(series.supportsLocationSearch, true);
    assert.equal(series.supportsCertificateNumberSearch, true);
});


test("listSeries() reports certificate-number search as false for every series except CM1132, CM1135, SE46, and CE502", () => {
    const withCertSearch = new Set(["CM1132", "CM1135", "SE46", "CE502"]);
    const series = listSeries().filter(s => !withCertSearch.has(s.name));
    assert.ok(series.every(s => s.supportsCertificateNumberSearch === false));
});


test("CM1132's dateRange reflects the real first and last record", () => {
    const series = listSeries().find(s => s.name === "CM1132");
    assert.deepEqual(series.dateRange, { startYear: 1874, startMonth: 12, endYear: 1950, endMonth: 1 });
});

test("lookupCertificate() returns no page link for CM1132-31 ( large file view issue, no page viewer)", () => {
    const results = lookupCertificate("99000", { recordType: "death" });

    assert.equal(results[0].number, 31);
    assert.equal(results[0].approximatePageUrl, null);
});
