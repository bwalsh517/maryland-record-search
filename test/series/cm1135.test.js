const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, listSeries } = require("../../src/index.js");


test("CM1135-1, CM1135-51, CM1135-101 resolve to the exact given archive.org URLs", () => {
    assert.equal(
        lookup({ series: "CM1135-1" })[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-001/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-001/"
    );

    assert.equal(
        lookup({ series: "CM1135-51" })[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-051/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-051/"
    );

    assert.equal(
        lookup({ series: "CM1135-101" })[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-101/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-101/"
    );
});


test("CM1135-150 is the last archive.org record, correctly in the 101-150 chunk", () => {
    assert.equal(
        lookup({ series: "CM1135-150" })[0].url,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-101/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-150/"
    );
});


test("CM1135-151 through CM1135-670 resolve to the MSA guide URL pattern", () => {
    assert.equal(
        lookup({ series: "CM1135-151" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-151"
    );

    assert.equal(
        lookup({ series: "CM1135-670" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-670"
    );

    assert.equal(
        lookup({ series: "CM1135-400" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-400"
    );
});


test("CM1135 number 0 or past 670 returns no results", () => {
    assert.deepEqual(lookup({ series: "CM1135-0" }), []);
    assert.deepEqual(lookup({ series: "CM1135-671" }), []);
});


test("msaGuideUrl is always present alongside url, even when url is the same MSA page (no archive.org scan)", () => {
    const scanned = lookup({ series: "CM1135-1" })[0];
    const msaOnly = lookup({ series: "CM1135-400" })[0];

    assert.equal(scanned.url, "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-001/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-001/");
    assert.equal(scanned.msaGuideUrl, "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-1");

    assert.equal(msaOnly.url, "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-400");
    assert.equal(msaOnly.msaGuideUrl, "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-400");
});


test("CM1135 only handles Baltimore City", () => {
    assert.ok(lookup({ location: "Talbot", month: 6, year: 1900, recordType: "birth" }).every(r => r.series !== "CM1135"));
});


test("listSeries() reports CM1135 as supporting both location and certificate search now, with a narrower certificateSearchRange than its full dateRange", () => {
    const series = listSeries().find(s => s.name === "CM1135");

    assert.ok(series);
    assert.equal(series.recordType, "birth");
    assert.equal(series.supportsLocationSearch, true);
    assert.equal(series.supportsCertificateNumberSearch, true);
    assert.deepEqual(series.dateRange, { startYear: 1875, startMonth: 0, endYear: 1972, endMonth: 0 });
    assert.deepEqual(series.certificateSearchRange, { startYear: 1875, startMonth: 1, endYear: 1947, endMonth: 12 });
});


test("CM1135's dateRange (month 0 boundaries) correctly gates canHandle at both ends", () => {
    const cm1135 = require("../../src/series/cm1135.js");

    assert.equal(cm1135.canHandle("Baltimore City", 1, 1875), true);
    assert.equal(cm1135.canHandle("Baltimore City", 12, 1972), true);
    assert.equal(cm1135.canHandle("Baltimore City", 12, 1874), false);
    assert.equal(cm1135.canHandle("Baltimore City", 1, 1973), false);
});


test("location/date search finds CM1135-1 for its exact opening month", () => {
    const results = lookup({ location: "Baltimore City", month: 1, year: 1875, recordType: "birth" });
    const main = results.filter(r => r.number === 1);

    assert.equal(main.length, 1);
    assert.equal(main[0].label, "01/1875-08/1875 Nos. 1-4800");
    assert.equal(main[0].url, lookup({ series: "CM1135-1" })[0].url);
});


test("a boundary month shared by two adjacent records returns both, same convention as CM1132", () => {
    // CM1135-1 ends 08/1875, CM1135-2 starts 08/1875.
    const results = lookup({ location: "Baltimore City", month: 8, year: 1875, recordType: "birth" })
        .filter(r => r.number === 1 || r.number === 2);

    assert.equal(results.length, 2);
});


test("CM1135-113 (multipart): a single month only ever returns one hit, tagged with its part", () => {
    const marchResults = lookup({ location: "Baltimore City", month: 4, year: 1916, recordType: "birth" })
        .filter(r => r.number === 113);
    const septResults = lookup({ location: "Baltimore City", month: 10, year: 1916, recordType: "birth" })
        .filter(r => r.number === 113);

    assert.equal(marchResults.length, 1);
    assert.equal(marchResults[0].part, 1);

    assert.equal(septResults.length, 1);
    assert.equal(septResults[0].part, 2);
});


test("CM1135-113 (multipart): a full-year search returns both parts, not deduped down to one", () => {
    const results = lookup({ location: "Baltimore City", year: 1916, recordType: "birth" })
        .filter(r => r.number === 113);

    assert.equal(results.length, 2);
    assert.deepEqual(results.map(r => r.part).sort(), [1, 2]);
});


test("a year with no lost-number coverage returns only main-sequence records", () => {
    const results = lookup({ location: "Baltimore City", year: 1875, recordType: "birth" });

    assert.ok(results.some(r => r.number === 28)); // 1875-1896 lost set does cover 1875
    assert.ok(results.every(r => r.number !== 26)); // 1892-1895 lost set does not
});


test("lost-number sets (CM1135-25 through 29) are always appended after main-sequence matches, narrowest span first", () => {
    // 1892 falls inside every one of the five lost-number spans.
    const results = lookup({ location: "Baltimore City", year: 1892, recordType: "birth" });
    const isLost = n => n >= 25 && n <= 29;
    const mainCount = results.filter(r => !isLost(r.number)).length;
    const lostNumbers = results.filter(r => isLost(r.number)).map(r => r.number);

    assert.ok(mainCount > 0);
    assert.deepEqual(results.slice(0, mainCount).every(r => !isLost(r.number)), true);
    // spans: 26=3yr, 29=6yr, 25=9yr, 28=21yr, 27=24yr - ascending by span length
    assert.deepEqual(lostNumbers, [26, 29, 25, 28, 27]);
});


test("certificate lookup: the legacy letter-dash style (A-1234) works the same as CM1132's, via the shared splitCertificateQuery helper", () => {
    assert.deepEqual(
        lookup({ certificateNumber: "A-10295", recordType: "birth" }).map(r => r.number).sort((a, b) => a - b),
        [31, 71]
    );

    assert.deepEqual(
        lookup({ certificateNumber: "1893-A-50000", recordType: "birth" }).map(r => r.number),
        [37]
    );
});


test("certificate lookup: a plain number with no year prefix returns every record whose reused letter block contains it", () => {
    // "A" cycles twice - CM1135-37 (1893) and CM1135-85 (1909) both cover A50000.
    const results = lookup({ certificateNumber: "A50000", recordType: "birth" });
    const numbers = results.map(r => r.number).sort((a, b) => a - b);

    assert.deepEqual(numbers, [37, 85]);
});


test("certificate lookup: a year prefix disambiguates a reused letter down to one record", () => {
    assert.deepEqual(
        lookup({ certificateNumber: "1893-A50000", recordType: "birth" }).map(r => r.number),
        [37]
    );

    assert.deepEqual(
        lookup({ certificateNumber: "1909-A50000", recordType: "birth" }).map(r => r.number),
        [85]
    );
});


test("certificate lookup: a year prefix that doesn't cover the number returns nothing", () => {
    assert.deepEqual(lookup({ certificateNumber: "1950-A50000", recordType: "birth" }), []);
});


test("certificate lookup: L numbers (lost-number sets) resolve directly, independent of the main letter cycle", () => {
    const results = lookup({ certificateNumber: "L500", recordType: "birth" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 25);
    assert.equal(results[0].certificateNumber, "L00500");
});


test("certificate lookup: a trailing suffix (e.g. the 'D' in G33501D) matches with or without the suffix, narrows with it", () => {
    const plain = lookup({ certificateNumber: "G33501", recordType: "birth" });
    const lettered = lookup({ certificateNumber: "G33501D", recordType: "birth" });

    assert.equal(plain.length, 1);
    assert.equal(plain[0].number, 300);
    assert.equal(plain[0].certificateNumber, "G33501D");

    assert.equal(lettered.length, 1);
    assert.equal(lettered[0].number, 300);
});


test("certificate lookup: CM1135-241's gap-estimated range resolves and is labeled as unconfirmed", () => {
    const results = lookup({ certificateNumber: "E75000", recordType: "birth" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 241);
    assert.match(results[0].label, /not independently confirmed/);
});


test("certificate lookup: a number just outside CM1135-241's estimated gap does not match it", () => {
    // CM1135-240 ends E73500, CM1135-242 starts E76001 - the gap is E73501-E76000.
    assert.deepEqual(
        lookup({ certificateNumber: "E73500", recordType: "birth" }).map(r => r.number),
        [240]
    );
    assert.deepEqual(
        lookup({ certificateNumber: "E76001", recordType: "birth" }).map(r => r.number),
        [242]
    );
});


test("certificate lookup: MSA-guide-only records (past CM1135-150) still resolve, with no approximatePageUrl", () => {
    const results = lookup({ certificateNumber: "C40100", recordType: "birth" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 151);
    assert.equal(results[0].url, "https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-151");
    assert.equal(results[0].approximatePageUrl, null);
});


test("certificate lookup: a scanned record (CM1135-1 through 150) gets an approximatePageUrl, same one-cert-per-page math as CM1132", () => {
    // CM1135-31 covers A05605-A10750, archive.org URL confirmed in cm1135.test.js above.
    const results = lookup({ certificateNumber: "A10295", recordType: "birth" });
    const r31 = results.find(r => r.number === 31);

    assert.ok(r31);
    assert.equal(
        r31.approximatePageUrl,
        "https://archive.org/details/reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-001/Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-031/page/n4690/mode/1up"
    );
});


test("certificate lookup: the same letter+number can legitimately match both CM1132 (death) and CM1135 (birth) - recordType is what disambiguates", () => {
    // A10295 falls inside CM1132-34 (death) AND CM1135-31/CM1135-71 (birth, two generations of the A block).
    const unscoped = lookup({ certificateNumber: "A10295" });
    const birthOnly = lookup({ certificateNumber: "A10295", recordType: "birth" });
    const deathOnly = lookup({ certificateNumber: "A10295", recordType: "death" });

    assert.ok(unscoped.some(r => r.series === "CM1132"));
    assert.ok(unscoped.some(r => r.series === "CM1135"));

    assert.ok(birthOnly.every(r => r.series === "CM1135"));
    assert.ok(deathOnly.every(r => r.series === "CM1132"));
});


test("certificate lookup: a number outside CM1135's certificateSearchRange (post-1947, not yet transcribed) returns nothing", () => {
    assert.deepEqual(lookup({ certificateNumber: "1960-A1", recordType: "birth" }), []);
});
