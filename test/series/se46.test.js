const test = require("node:test");
const assert = require("node:assert/strict");

const { lookup, lookupYear, lookupSeries, lookupCertificate, listSeries } = require("../../src/index.js");


test("date search resolves an unsplit county to a single record (Allegany, first jurisdiction alphabetically)", () => {
    const results = lookup({ location: "Allegany", month: 7, year: 1973, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 162);
});


test("regression: label never repeats the location, which is already a separate field", () => {
    // An unsplit record's label should be empty, not the location name
    // again - the location field already carries that.
    const unsplit = lookup({ location: "Howard", month: 1, year: 1973, recordType: "death" })[0];
    assert.equal(unsplit.label, "");

    // A split record's label should be just the extra detail, not
    // "Baltimore City Baltimore City (A-G) ...".
    const split = lookup({ location: "Baltimore City", month: 1, year: 1982, recordType: "death" })[0];
    assert.equal(split.label, "(A-G) Nos. 632-1021");
    assert.ok(!split.label.includes(split.location));
});


test("date search resolves the last jurisdiction alphabetically (Worcester)", () => {
    const results = lookup({ location: "Worcester", month: 7, year: 1973, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 188);
});


test("date search resolves a split jurisdiction to all of its parts, in order", () => {
    const results = lookup({ location: "Baltimore City", month: 7, year: 1973, recordType: "death" });

    assert.deepEqual(results.map(r => r.number), [166, 167]);
});


test("date search covers Baltimore City as its own jurisdiction (unlike CM1132/CE502's Baltimore-City-only scope)", () => {
    const results = lookup({ location: "Baltimore City", month: 1, year: 1973, recordType: "death" });

    assert.equal(results.length, 3);
    assert.deepEqual(results.map(r => r.number), [5, 6, 7]);
});


test("date search correctly resolves August 1973 onward, now that the unassigned-number gap is accounted for", () => {
    assert.deepEqual(
        lookup({ location: "Baltimore", month: 8, year: 1973, recordType: "death" }).map(r => r.number),
        [192, 193]
    );
});


test("date search correctly skips an unassigned number that falls inside a jurisdiction's own multi-part split", () => {
    // SE46-1606 is unassigned, sitting between Montgomery's two Dec
    // 1977 parts (A-S and S-Z) - the second part is 1607, not 1606.
    assert.deepEqual(
        lookup({ location: "Montgomery", month: 12, year: 1977, recordType: "death" }).map(r => r.number),
        [1605, 1607]
    );
});


test("series lookup: confirmed unassigned numbers resolve to an informative result with no URL", () => {
    assert.deepEqual(lookupSeries("SE46-189")[0], {
        series: "SE46",
        seriesType: "death",
        seriesHome: "http://guide.msa.maryland.gov/pages/series.aspx?action=viewseries&id=se46",
        location: null,
        year: null,
        month: null,
        msaGuideUrl: "https://guide.msa.maryland.gov/pages/item.aspx?ID=SE46-189",
        number: 189,
        label: "Unassigned",
        url: null,
        certificateNumber: null,
        approximatePageUrl: null
    });

    assert.equal(lookupSeries("SE46-1606")[0].label, "Unassigned");
    assert.equal(lookupSeries("SE46-1606")[0].url, null);
});


test("date search past SE46's whole coverage (2015 onward) returns nothing", () => {
    assert.deepEqual(
        lookup({ location: "Baltimore", month: 1, year: 2015, recordType: "death" }),
        []
    );
});


test("date/year search for 1988-2014 falls back to every record for that year, since there's no location dimension", () => {
    // No location or month breakdown exists in the source data for
    // this era at all - searching any county returns the same
    // statewide list, with location and month left null since the
    // result genuinely isn't about the county that was searched.
    const results = lookup({ location: "Howard", year: 1999, month: 5, recordType: "death" });

    assert.equal(results.length, 86);
    assert.equal(results[0].location, null);
    assert.equal(results[0].month, null);
    assert.equal(results[0].number, 5803);
    assert.ok(results[0].label.includes("statewide, not narrowed by county"));

    // Searching a different county for the same year returns the
    // identical list, confirming it's genuinely not narrowed at all.
    const otherCounty = lookup({ location: "Worcester", year: 1999, recordType: "death" });
    assert.deepEqual(results.map(r => r.number), otherCounty.map(r => r.number));
});


test("lookupYear for 1988-2014 doesn't duplicate the statewide fallback across all 12 months", () => {
    const results = lookupYear({ location: "Howard", year: 1999, recordType: "death" });
    const numbers = results.map(r => r.number);

    assert.equal(numbers.length, 86);
    assert.equal(numbers.length, new Set(numbers).size, "no duplicate record numbers");
});


test("Worcester's late-files label applies to every December (1973-1987), not just 1987", () => {
    // Confirmed for multiple years, not just the one originally
    // hardcoded (1987) - spot-checked across the range, now with
    // known cert ranges too.
    const expected = {
        1973: [325, "(also includes late files for the year) Nos. 32154-32185"],
        1974: [645, "(also includes late files for the year) Nos. 32104-32143"],
        1980: [2582, "(also includes late files for the year) Nos. 33316-33397"],
        1987: [4909, "(also includes late files for the year) Nos. 37333-37454"]
    };

    for (const [year, [number, label]] of Object.entries(expected)) {
        const results = lookup({ location: "Worcester", month: 12, year: Number(year), recordType: "death" });
        assert.equal(results.length, 1, `Worcester Dec ${year} should resolve to one record`);
        assert.equal(results[0].number, number);
        assert.equal(results[0].label, label);
    }
});


test("Worcester's December 1984 record has a confirmed cert range, despite the certificate ordering anomaly (34948 scanned first, not last)", () => {
    const results = lookup({ location: "Worcester", month: 12, year: 1984, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 3901);
    assert.equal(results[0].label, "(also includes late files for the year) Nos. 34683-34948");
});



test("Worcester's late-files label does not apply outside December", () => {
    const results = lookup({ location: "Worcester", month: 6, year: 1975, recordType: "death" });
    assert.equal(results[0].label, "");
});


test("series lookup: SE46-645 (Dec 1974 Worcester) carries the late-files label too, found by number alone", () => {
    const result = lookupSeries("SE46-645")[0];

    assert.equal(result.label, "Worcester (also includes late files for the year) Nos. 32104-32143");
    assert.ok(result.url);
});


test("the full 1973-1987 grid closes exactly on the Worcester = SE46-4909 anchor", () => {
    const results = lookup({ location: "Worcester", month: 12, year: 1987, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 4909);
    assert.equal(results[0].label, "(also includes late files for the year) Nos. 37333-37454");
});


test("Baltimore's Aug 1979 trailing special is the only Baltimore record that month, confirmed", () => {
    // Baltimore's regular Aug 1979 slot was genuinely pulled out - the
    // apparent "extra" record was actually a missed one-letter split
    // in Baltimore City that same month (SE46-2132, surname "A"
    // only), not a supplement to a separate Baltimore record.
    const results = lookup({ location: "Baltimore", month: 8, year: 1979, recordType: "death" });

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 4913);
});


test("Baltimore City's Aug 1979 one-letter split ('A' only) resolves correctly", () => {
    const results = lookup({ location: "Baltimore City", month: 8, year: 1979, recordType: "death" });

    assert.deepEqual(results.map(r => r.number), [2132, 2133, 2134]);
    assert.equal(results[0].label, "(A) Nos. 19036-19057");
});


test("March 1986 is a confirmed exception to alphabetical order - Prince George's numbered before Montgomery", () => {
    assert.deepEqual(
        lookup({ location: "Montgomery", month: 3, year: 1986, recordType: "death" }).map(r => r.number),
        [4315, 4316]
    );
    assert.deepEqual(
        lookup({ location: "Prince George's", month: 3, year: 1986, recordType: "death" }).map(r => r.number),
        [4313, 4314]
    );
});


test("certificate lookup resolves within the 1988 literal table", () => {
    const results = lookupCertificate("1988-1");

    assert.equal(results.length, 1);
    assert.equal(results[0].number, 4917);
    assert.equal(results[0].label, "Nos. 1-400");
});


test("certificate lookup rolls over to the next record correctly", () => {
    assert.equal(lookupCertificate("1988-401")[0].number, 4918);
});


test("regression: 7 years have an oversized final lot (over 500 certs), not undersized - certificates in that overflow used to silently resolve to a nonexistent lot", () => {
    // Each pair is [year, last certificate of the year, true last record
    // number]. Before this fix, deriving the last lot from
    // ceil(totalCerts/500) assumed the last lot could only be
    // undersized, computing a lot number one past the real last one
    // for these specific years.
    const affectedYears = [
        [1994, 40503, 5469], [1995, 41512, 5552], [1996, 41604, 5635],
        [1997, 41551, 5718], [2003, 44521, 6241], [2012, 44515, 7031],
        [2014, 46007, 7215]
    ];

    for (const [year, lastCert, expectedNumber] of affectedYears) {
        const result = lookupCertificate(`${year}-${lastCert}`);
        assert.equal(result.length, 1, `${year}-${lastCert} should resolve to exactly one record`);
        assert.equal(result[0].number, expectedNumber, `${year}'s last certificate should resolve to SE46-${expectedNumber}`);
        assert.ok(result[0].url, `${year}'s last record should have a real URL, not null from a nonexistent lot`);
    }
});


test("certificate lookup matches the exact given page-jump example (SE46-5080, certs 1-4)", () => {
    const pages = [1, 2, 3, 4].map(cert => {
        const url = lookupCertificate(`1990-${cert}`)[0].approximatePageUrl;
        return Number(url.match(/n(\d+)/)[1]);
    });

    assert.deepEqual(pages, [0, 2, 4, 6]);
});


test("certificate lookup's page multiplier switches from x2 to x1 exactly at 2002 (certificate backs stop being scanned)", () => {
    const page2001 = Number(lookupCertificate("2001-3")[0].approximatePageUrl.match(/n(\d+)/)[1]);
    const page2002 = Number(lookupCertificate("2002-3")[0].approximatePageUrl.match(/n(\d+)/)[1]);

    assert.equal(page2001, 4);
    assert.equal(page2002, 2);
});


test("certificate lookup resolves 2013-2014 to the exact record via the MSA guide, with no page-jump link", () => {
    const results2013 = lookupCertificate("2013-100");

    assert.equal(results2013.length, 1);
    assert.equal(results2013[0].number, 7032);
    assert.equal(results2013[0].url, "https://guide.msa.maryland.gov/pages/item.aspx?ID=SE46-7032");
    assert.equal(results2013[0].approximatePageUrl, null);

    const results2014 = lookupCertificate("2014-45999");

    assert.equal(results2014.length, 1);
    assert.equal(results2014[0].number, 7215);
    assert.equal(results2014[0].url, "https://guide.msa.maryland.gov/pages/item.aspx?ID=SE46-7215");
    assert.equal(results2014[0].approximatePageUrl, null);
});


test("certificate lookup handles 1990's 7 irregular middle lots as an explicit override", () => {
    // Cert 24700 falls inside SE46-5129's irregular range (24504-25004).
    assert.equal(lookupCertificate("1990-24700")[0].number, 5129);
});


test("certificate lookup uses the standard formula outside 1990's irregular zone", () => {
    // Cert 23600 is well before the irregular block starts (24001).
    assert.equal(lookupCertificate("1990-23600")[0].number, 5127);
});


test("certificate lookup rejects a certificate number below 1", () => {
    const se46 = require("../../src/series/se46.js");
    assert.deepEqual(se46.lookupCertificateNumber("1990-0"), []);
});


test("date search for a genuinely invalid location returns nothing rather than throwing", () => {
    // A location string canHandle() would never even route here in
    // practice (lookup() normalizes first), but lookupLocationMonthYear
    // itself should still degrade gracefully if it's ever called
    // directly with something that isn't one of the 24 jurisdictions.
    const se46 = require("../../src/series/se46.js");
    assert.deepEqual(se46.lookupLocationMonthYear("Not A Real Place", 7, 1973), []);
});


test("certificate lookup rejects malformed input", () => {
    const se46 = require("../../src/series/se46.js");

    assert.deepEqual(se46.lookupCertificateNumber("not-a-cert"), []);
    assert.deepEqual(se46.lookupCertificateNumber("1990"), []);
    assert.deepEqual(se46.lookupCertificateNumber(""), []);
});


test("series lookup: the 6065-6241 sub-range uses unpadded folder names, confirmed against a real file listing", () => {
    assert.equal(
        lookupSeries("SE46-6153")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-46-005977-6241/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_6153/"
    );
});


test("series lookup: padding reverts to normal just before the unpadded sub-range starts", () => {
    assert.equal(
        lookupSeries("SE46-6064")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-46-005977-6241/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_006064/"
    );
});


test("series lookup: the unpadded numbering continues past the first collection, through the end of archive.org's 2012 coverage", () => {
    assert.equal(
        lookupSeries("SE46-6300")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-46-6242-6503/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_6300/"
    );
    assert.equal(
        lookupSeries("SE46-7031")[0].url,
        "https://archive.org/details/reclaim-the-records-maryland-death-certificates-msa-se-46-6768-7031/Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_7031/"
    );
});


test("series lookup: 2013-2014 (SE46-7032 to SE46-7215) resolve to the MSA guide, not archive.org", () => {
    assert.equal(
        lookupSeries("SE46-7215")[0].url,
        "https://guide.msa.maryland.gov/pages/item.aspx?ID=SE46-7215"
    );
});


test("series lookup: the archive.org/MSA-guide boundary is exactly between SE46-7031 and SE46-7032", () => {
    assert.ok(lookupSeries("SE46-7031")[0].url.startsWith("https://archive.org/"));
    assert.ok(lookupSeries("SE46-7032")[0].url.startsWith("https://guide.msa.maryland.gov/"));
});


test("series lookup: SE46-4909 carries the Worcester-plus-late-files label", () => {
    const result = lookupSeries("SE46-4909")[0];

    assert.equal(result.label, "Worcester (also includes late files for the year) Nos. 37333-37454");
    assert.ok(result.url);
});


test("lookupYear covers a whole year within the verified range without duplicates", () => {
    const results = lookupYear({ location: "Baltimore City", year: 1973, recordType: "death" });
    const numbers = results.map(r => r.number);

    assert.equal(numbers.length, new Set(numbers).size, "no duplicate record numbers");
    assert.ok(numbers.length > 0);
});


test("listSeries() reports SE46 with both location and certificate-number search implemented", () => {
    const series = listSeries().find(s => s.name === "SE46");

    assert.ok(series);
    assert.equal(series.supportsLocationSearch, true);
    assert.equal(series.supportsCertificateNumberSearch, true);

    // Certificate search covers a genuinely narrower range than the
    // series itself (1988-2014 vs the full 1973-2014, since 1973-1987
    // isn't covered by certificate lookup) - explicitly set, not
    // defaulted, since this is the one series where the default
    // (matching dateRange) wouldn't be accurate.
    assert.deepEqual(series.certificateSearchRange, {
        startYear: 1988, startMonth: 0, endYear: 2014, endMonth: 0
    });
    assert.notDeepEqual(series.certificateSearchRange, series.dateRange);
});


test("listSeries()'s certificateSearchRange defaults to a series' full dateRange when not explicitly narrower", () => {
    const cm1132 = listSeries().find(s => s.name === "CM1132");

    assert.ok(cm1132.supportsCertificateNumberSearch);
    assert.deepEqual(cm1132.certificateSearchRange, cm1132.dateRange);
});


test("listSeries()'s certificateSearchRange is null for series without certificate search at all", () => {
    const se42 = listSeries().find(s => s.name === "SE42");

    assert.equal(se42.supportsCertificateNumberSearch, false);
    assert.equal(se42.certificateSearchRange, null);
});
