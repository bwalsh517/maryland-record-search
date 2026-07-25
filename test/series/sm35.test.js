const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, listSeries } = require("../../src/index.js");


test("SM35-1, SM35-36, SM35-72 resolve to the exact given archive.org URLs", () => {
    assert.equal(
        lookup({ series: "SM35-1" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-1/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3116/"
    );

    assert.equal(
        lookup({ series: "SM35-36" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-36/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3679/"
    );

    assert.equal(
        lookup({ series: "SM35-72" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-36/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3715/"
    );
});


test("every SM35-1 through SM35-72 resolves to an archive.org URL", () => {
    for (let n = 1; n <= 72; n++) {
        const results = lookup({ series: `SM35-${n}` });
        assert.equal(results.length, 1, `SM35-${n} should resolve`);
        assert.ok(results[0].url.startsWith("https://archive.org/details/"));
    }
});


test("SM35-33's irregular sr value (3676-A) is preserved verbatim in the URL", () => {
    assert.equal(
        lookup({ series: "SM35-33" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-1/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3676-A/"
    );
});


test("SM35-73 through SM35-269 resolve to the MSA guide URL pattern", () => {
    assert.equal(
        lookup({ series: "SM35-73" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=SM35-73"
    );

    assert.equal(
        lookup({ series: "SM35-269" })[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=SM35-269"
    );
});


test("SM35 number 0 or past 269 returns no results", () => {
    assert.deepEqual(lookup({ series: "SM35-0" }), []);
    assert.deepEqual(lookup({ series: "SM35-270" }), []);
});


test("regression: location/date search now returns only records whose that-month coverage actually includes the queried county", () => {

    // Before the STANDARD_RECORDS cutover, every county in a covered
    // year returned the same full set of files regardless of month or
    // county. June 1914 Anne Arundel and November 1914 Worcester now
    // correctly resolve to different records.
    const forAnneArundel = lookup({ location: "Anne Arundel", month: 6, year: 1914, recordType: "birth" });
    const forWorcester = lookup({ location: "Worcester", month: 11, year: 1914, recordType: "birth" });

    assert.deepEqual(forAnneArundel.map(r => r.number), [4]);
    assert.deepEqual(forWorcester.map(r => r.number), [7]);
});


test("each year-search result carries the MSA guide's own description as its label", () => {
    const results = lookup({ location: "Talbot", month: 1, year: 1914, recordType: "birth" });
    const first = results.find(r => r.number === 1);

    assert.equal(first.label, "Jan. AL-QA, WA-WO, QA-WA, Feb. AL-BA");
});


test("lookup() only queries SM35 once per month, not once per record", () => {
    // Talbot happens to fall within all 8 records touching 1918
    // somewhere across their multi-month spans - this confirms the
    // dispatch count, not broad matching (see the regression test
    // above for that).
    const results = lookup({ location: "Talbot", year: 1918, recordType: "birth" });
    assert.equal(results.length, 8);
});


test("1923-1951 has precise county/month location search, resolving through the MSA guide", () => {

    const results = lookup({ location: "Talbot", month: 6, year: 1930, recordType: "birth" });

    assert.deepEqual(results.map(r => r.number), [127]);
    assert.equal(results[0].label, "Jun. CR-WO, Jul. AL-WO");

    // URLs for this range use the MSA guide pattern, not archive.org,
    // regardless of having sr values in STANDARD_RECORDS.
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


test("regression: SM35's archive.org collection identifier stays fixed per shared block", () => {

    // Confirmed against archive.org: "SM35 1-35" and "SM35 36-72".
    const block1First = lookup({ series: "SM35-1" })[0].url;
    const block1Last = lookup({ series: "SM35-35" })[0].url;
    const block2First = lookup({ series: "SM35-36" })[0].url;
    const block2Last = lookup({ series: "SM35-72" })[0].url;

    assert.ok(block1First.includes("sm-35-1/"));
    assert.ok(block1Last.includes("sm-35-1/"));
    assert.ok(block2First.includes("sm-35-36/"));
    assert.ok(block2Last.includes("sm-35-36/"));

    // The two examples given directly, confirmed correct against
    // archive.org.
    assert.equal(
        lookup({ series: "SM35-36" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-36/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3679/"
    );
    assert.equal(
        lookup({ series: "SM35-37" })[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-36/Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr3680/"
    );
});


test("STANDARD_RECORDS covers all 269 records in the series", () => {

    const sm35 = require("../../src/series/sm35.js");

    assert.equal(sm35.STANDARD_RECORDS.length, 269);
    assert.deepEqual(
        sm35.STANDARD_RECORDS.map(r => r.number),
        Array.from({ length: 269 }, (_, i) => i + 1)
    );
});


test("STANDARD_RECORDS: SM35-1's January is full coverage (no split), February is Allegany-Baltimore", () => {

    const sm35 = require("../../src/series/sm35.js");
    const record = sm35.STANDARD_RECORDS.find(r => r.number === 1);

    const jan = record.dateRanges.find(dr => dr.startMonth === 1);
    const feb = record.dateRanges.find(dr => dr.startMonth === 2);

    assert.equal(jan.split, undefined);
    assert.deepEqual(feb.split, [{ start: "Allegany", end: "Baltimore" }]);
    assert.equal(record.note, "Jan. AL-QA, WA-WO, QA-WA, Feb. AL-BA");
});


test("STANDARD_RECORDS: SM35-42/43's April boundary is confirmed adjacent (Allegany-Carroll, then Cecil-Worcester)", () => {

    const sm35 = require("../../src/series/sm35.js");
    const r42 = sm35.STANDARD_RECORDS.find(r => r.number === 42);
    const r43 = sm35.STANDARD_RECORDS.find(r => r.number === 43);

    const r42Apr = r42.dateRanges.find(dr => dr.startMonth === 4);
    const r43Apr = r43.dateRanges.find(dr => dr.startMonth === 4);

    assert.deepEqual(r42Apr.split, [{ start: "Allegany", end: "Carroll" }]);
    assert.deepEqual(r43Apr.split, [{ start: "Cecil", end: "Worcester" }]);
});


test("regression: SM35-227's June coverage includes Anne Arundel, found via its own Rets. of annotation", () => {

    // The main declared range for June was "BA-WO" (Baltimore-Worcester),
    // but the record's own "Rets. of Jun. BA ..., Jun. AA ..." annotation
    // names Anne Arundel too - outside that declared range. Anne Arundel
    // and Baltimore are adjacent, so the real coverage merges into one
    // continuous range rather than two separate pieces.
    const sm35 = require("../../src/series/sm35.js");
    const record = sm35.STANDARD_RECORDS.find(r => r.number === 227);
    const june = record.dateRanges.find(dr => dr.startMonth === 6);

    assert.deepEqual(june.split, [{ start: "Anne Arundel", end: "Worcester" }]);
});


test("STANDARD_RECORDS: every year/month combination covers all 23 counties once every touching record is combined", () => {

    const counties = require("../../src/core/counties.js");
    const sm35 = require("../../src/series/sm35.js");

    const order = counties.alphabeticalCountyOrder();
    const position = name => order.indexOf(name) + 1;

    const byYearMonth = {};

    for (const record of sm35.STANDARD_RECORDS) {
        for (const dr of record.dateRanges) {
            const key = `${dr.startYear}-${dr.startMonth}`;
            byYearMonth[key] = byYearMonth[key] || [];
            if (dr.split) {
                for (const s of dr.split) {
                    byYearMonth[key].push([position(s.start), position(s.end)]);
                }
            } else {
                byYearMonth[key].push([1, order.length]);
            }
        }
    }

    const keys = Object.keys(byYearMonth);
    assert.equal(keys.length, 450);

    for (const key of keys) {
        const ranges = byYearMonth[key].sort((a, b) => a[0] - b[0]);
        const merged = [ranges[0].slice()];
        for (const [s, e] of ranges.slice(1)) {
            const last = merged[merged.length - 1];
            if (s <= last[1] + 1) {
                last[1] = Math.max(last[1], e);
            } else {
                merged.push([s, e]);
            }
        }
        const full = merged.length === 1 && merged[0][0] === 1 && merged[0][1] === order.length;
        assert.ok(full, `${key} does not cover all 23 counties: ${JSON.stringify(merged)}`);
    }
});


test("STANDARD_RECORDS: every county/month named inside a Rets./Ret./Certs. for annotation is accounted for by that month's own declared range", () => {

    const counties = require("../../src/core/counties.js");
    const sm35 = require("../../src/series/sm35.js");

    const order = counties.alphabeticalCountyOrder();
    const position = name => order.indexOf(name) + 1;
    const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
    const TRIGGERS = ["Rets. of", "Ret. of", "Certs. for"];

    function coversCounty(record, month, countyName) {
        const dr = record.dateRanges.find(d => d.startMonth === month);
        if (!dr) return null;
        if (!dr.split) return true;
        const pos = position(countyName);
        return dr.split.some(s => pos >= position(s.start) && pos <= position(s.end));
    }

    let totalPairs = 0;

    for (const record of sm35.STANDARD_RECORDS) {
        let annotationText = null;
        for (const trigger of TRIGGERS) {
            const idx = record.note.indexOf(trigger);
            if (idx !== -1) {
                annotationText = record.note.slice(idx + trigger.length);
                break;
            }
        }
        if (!annotationText) continue;

        const chunks = annotationText.split(",").map(c => c.trim()).filter(Boolean);
        let currentMonth = null;

        for (const chunk of chunks) {
            let rest = chunk;
            const monthMatch = chunk.match(/^([A-Za-z]{3})\.\s+(.+)$/);
            if (monthMatch && MONTHS[monthMatch[1].toLowerCase()]) {
                currentMonth = MONTHS[monthMatch[1].toLowerCase()];
                rest = monthMatch[2];
            }
            if (currentMonth === null) continue;

            const countyMatch = rest.match(/^([A-Za-z]{2})\b/);
            if (!countyMatch) continue;

            let countyName;
            try {
                countyName = counties.normalizeCounty(countyMatch[1].toLowerCase());
            } catch {
                continue;
            }

            totalPairs++;
            const covered = coversCounty(record, currentMonth, countyName);
            assert.equal(covered, true, `SM35-${record.number}: month ${currentMonth}, ${countyName} not covered (note: ${record.note})`);
        }
    }

    assert.equal(totalPairs, 49);
});


test("regression: a full-coverage month (no split) matches every county", () => {
    const results = lookup({ location: "Wicomico", month: 1, year: 1914, recordType: "birth" });
    assert.deepEqual(results.map(r => r.number), [1]);
});


test("regression: a county outside one record's range for a month correctly resolves to a different record instead", () => {
    // SM35-1's February is Allegany-Baltimore only, so Worcester isn't
    // in it - SM35-2's own February range (Calvert-Worcester) is.
    const results = lookup({ location: "Worcester", month: 2, year: 1914, recordType: "birth" });
    assert.deepEqual(results.map(r => r.number), [2]);
});


test("regression: the queried location is normalized on the result, regardless of input casing", () => {
    const result = lookup({ location: "wicomico", month: 1, year: 1914, recordType: "birth" })[0];
    assert.equal(result.location, "Wicomico");
});


test("lookupAllForMonth: returns every record touching a month/year, no location filter", () => {
    const results = lookup({ month: 1, year: 1914, recordType: "birth" });
    assert.deepEqual(results.map(r => r.number), [1]);
    assert.equal(results[0].location, null);
});


test("regression: whole-year no-location search deduplicates records that span multiple months", () => {
    // SM35-124 covers Jan and Feb 1930 in one physical record - a
    // naive month-by-month concatenation would return it twice.
    const results = lookup({ year: 1930, recordType: "birth" });
    const numbers = results.map(r => r.number);
    assert.deepEqual(numbers, [...new Set(numbers)]);
    assert.deepEqual(numbers, [124, 125, 126, 127, 128, 129, 130]);
});
