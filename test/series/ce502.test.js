const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupYear, lookupSeries, lookupCertificate, listSeries, SERIES } = require("../../src/index.js");

const ce502 = SERIES.find(s => s.name === "CE502");


test("CE502-1 and CE502-95 resolve to the correct archive.org URLs (across an ARCHIVE_RANGES boundary)", () => {
    assert.equal(
        lookupSeries("CE502-1")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-city-death-certificates-msa-ce-502-000001-94/Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_ce502_000001/"
    );

    assert.equal(
        lookupSeries("CE502-95")[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-city-death-certificates-msa-ce-502-000095-387/Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_ce502_000095/"
    );
});


test("listSeries() now reports CE502 as supporting both location and certificate search", () => {
    const entry = listSeries().find(s => s.name === "CE502");

    assert.ok(entry);
    assert.equal(entry.supportsLocationSearch, true);
    assert.equal(entry.supportsCertificateNumberSearch, true);
    // No narrower certificateSearchRange was set - certificate search
    // covers the whole series, same as its dateRange.
    assert.deepEqual(entry.certificateSearchRange, entry.dateRange);
});


test("date search returns every record whose span covers the requested month, including multiple in the same month", () => {
    // Fixed ~500-cert blocks mean records rarely align to calendar
    // month boundaries - most months are covered by 2+ overlapping
    // records here, unlike CM1132's cleaner boundaries. January 1951
    // is covered by CE502-24 (01/1951 only) and CE502-25 (01/1951-02/1951).
    const results = lookup({ location: "Baltimore City", month: 1, year: 1951, recordType: "death" });

    assert.deepEqual(results.map(r => r.number), [24, 25]);
    assert.equal(results[0].label, "01/1951 Nos. 1-500");
    assert.equal(results[1].label, "01/1951-02/1951 Nos. 501-1000");
});


test("date search surfaces BOTH series at the genuine CM1132/CE502 handoff month (01/1950), rather than hiding the overlap", () => {
    const results = lookup({ location: "Baltimore City", month: 1, year: 1950, recordType: "death" });

    assert.deepEqual(
        results.map(r => `${r.series}-${r.number}`).sort(),
        ["CE502-1", "CE502-2", "CM1132-248"]
    );
});


test("date search returns a record spanning two months for either month it covers", () => {
    const jan = lookup({ location: "Baltimore City", month: 1, year: 1950, recordType: "death" });
    const feb = lookup({ location: "Baltimore City", month: 2, year: 1950, recordType: "death" });

    // CE502-2 spans 01/1950-02/1950
    assert.ok(jan.some(r => r.number === 2));
    assert.ok(feb.some(r => r.number === 2));
});


test("lookupYear() shows every record exactly once, in order, for a year with several multi-month records", () => {
    // 1951, not 1950 - 1950 also picks up CM1132-248 from the genuine
    // boundary overlap covered above, which isn't what this test is
    // checking for.
    const results = lookupYear({ location: "Baltimore City", year: 1951, recordType: "death" });
    const numbers = results.map(r => r.number);

    assert.equal(numbers.length, new Set(numbers).size, "no duplicate record numbers");
    assert.deepEqual(numbers, [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]);
});


test("certificate search resolves a normal (non-duplicate) certificate to its record and page", () => {
    // CE502-2: Nos. 501-1000, so certificate 501 is the first in the
    // record - page 0, 2 pages/cert (backs scanned, same as SE46's
    // pre-2002 era).
    const results = lookupCertificate("1950-501", { recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 2);
    assert.equal(results[0].approximatePageUrl.endsWith("page/n0/mode/1up"), true);

    // Certificate 502 - one position later, so 2 pages further in.
    const next = lookupCertificate("1950-502", { recordType: "death" });
    assert.equal(next[0].approximatePageUrl.endsWith("page/n2/mode/1up"), true);
});


test("certificate search returns BOTH records for the confirmed duplicate 3000 in 1952, not just one", () => {
    // CE502-52 (2501-3000) and CE502-53 (whose range begins with the
    // second, "A"-labeled 3000) both genuinely contain 3000 - see
    // ce502-data.js's header comment. The caller shouldn't need to
    // know to type "3000A" to find the second one.
    const results = lookupCertificate("1952-3000", { recordType: "death" });

    assert.equal(results.length, 2);
    assert.deepEqual(results.map(r => r.number).sort((a, b) => a - b), [52, 53]);

    const r53 = results.find(r => r.number === 53);
    assert.equal(r53.label, "03/1952-04/1952 Nos. 3000(A)-3500");
    // First certificate in CE502-53's own range - page 0, same as any
    // other record's first certificate.
    assert.equal(r53.approximatePageUrl.endsWith("page/n0/mode/1up"), true);
});


test("certificate search returns just CE502-53 when the caller explicitly asks for the \"A\" duplicate", () => {
    const results = lookupCertificate("1952-3000A", { recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 53);
    assert.equal(results[0].certificateNumber, "1952-3000A");
    assert.equal(results[0].approximatePageUrl.endsWith("page/n0/mode/1up"), true);
});


test("certificate search with the letter suffix is case-insensitive", () => {
    const upper = lookupCertificate("1952-3000A", { recordType: "death" });
    const lower = lookupCertificate("1952-3000a", { recordType: "death" });

    assert.deepEqual(upper, lower);
});


test("certificate search rejects a letter that doesn't match any known duplicate, rather than guessing", () => {
    // Wrong letter on the real duplicate.
    assert.deepEqual(ce502.lookupCertificateNumber("1952-3000B"), []);
    // A letter on a number that has no duplicate at all.
    assert.deepEqual(ce502.lookupCertificateNumber("1950-501A"), []);
});


test("certificate search correctly returns nothing for a certificate number that doesn't exist that year", () => {
    // 1950 tops out at 11327 (CE502-23).
    assert.deepEqual(lookupCertificate("1950-11328", { recordType: "death" }), []);
});


test("certificate search rejects malformed input", () => {
    // Checked against the CE502 instance directly, not the global
    // lookupCertificate() - a bare "3000" is valid input for CM1132's
    // own (unrelated) numbering scheme, so it isn't malformed from the
    // global function's point of view, only from CE502's.
    assert.deepEqual(ce502.lookupCertificateNumber("3000"), []);
    assert.deepEqual(ce502.lookupCertificateNumber("nonsense"), []);
    assert.deepEqual(ce502.lookupCertificateNumber(""), []);
});


test("certificate search resets correctly at a year boundary", () => {
    // 1950's last record (CE502-23) ends at 11327; 1951 restarts at 1
    // on CE502-24, not a continuation of 1950's numbering.
    const results = lookupCertificate("1951-1", { recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 24);
});


test("canHandle() rejects a county other than Baltimore City", () => {
    assert.deepEqual(
        lookup({ location: "Anne Arundel", month: 1, year: 1950, recordType: "death" }).filter(r => r.series === "CE502"),
        []
    );
});
