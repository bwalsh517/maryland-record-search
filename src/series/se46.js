if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
    require("./se46-data.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const counties = global.MDRecordSearch.counties;
    const DATA = global.MDRecordSearch.SE46_DATA;

    // SPLIT_MONTHS covers the full 1973-1987 grid, verified end-to-end
    // against the Worcester = SE46-4909 anchor (see se46-data.js's
    // header comment). SE46-4910 through 4916 (the trailing specials)
    // and everything from 1988 onward are handled separately.
    const GRID_DATA_START = 1973 * 12 + 1;
    const GRID_DATA_END = 1987 * 12 + 12;

    function monthValue(year, month) {
        return year * 12 + month;
    }

    // Skips forward past any confirmed-unassigned number (see
    // UNASSIGNED_RECORDS in se46-data.js). Applied per individual
    // number, not just once per jurisdiction - an unassigned number
    // can fall between two parts of the SAME jurisdiction's own
    // multi-part split (SE46-1606 does, inside Montgomery's Dec 1977
    // A-S/S-Z split), not only at a jurisdiction boundary.
    function nextAssignedNumber(cursor) {

        while (DATA.UNASSIGNED_RECORDS[cursor]) {
            cursor += 1;
        }

        return cursor;
    }

    // 2013-2014 (SE46-7032 to SE46-7215) were never uploaded to
    // archive.org - BaseSeries.archiveUrl()'s default MSA fallback
    // handles the URL itself with no override needed here.
    // isMsaGuideOnly() is still needed separately, to skip
    // approximatePageUrl's page-jump math below, which doesn't apply to
    // an MSA-only link.
    function isMsaGuideOnly(number) {
        return number >= 7032 && number <= 7215;
    }

    // Every record for a given year, 1988-2014 - no location or month
    // dimension exists in this era at all, so this is the complete
    // list regardless of what was searched for (see
    // lookupLocationMonthYear()'s year-only fallback below).
    function allRecordsForYear(year) {

        if (year === 1988 || year === 1989) {
            return DATA.RECORDS_1988_1989
                .filter(r => r.year === year)
                .map(r => ({ number: r.number, certStart: r.certStart, certEnd: r.certEnd }));
        }

        const meta = DATA.YEAR_METADATA[year];

        if (!meta) {
            return [];
        }

        const { firstNumber, lastNumber, totalCerts } = meta;
        const records = [];

        for (let number = firstNumber; number <= lastNumber; number++) {

            const exception = year === 1990 ? DATA.YEAR_1990_EXCEPTIONS[number] : null;

            if (exception) {
                records.push({ number, certStart: exception.certStart, certEnd: exception.certEnd });
                continue;
            }

            const i = number - firstNumber;
            const certStart = i * 500 + 1;
            const certEnd = number === lastNumber ? totalCerts : certStart + 499;
            records.push({ number, certStart, certEnd });
        }

        return records;
    }

    function parseYearCertificate(input) {

        const match = String(input || "").trim().match(/^(\d{4})-(\d+)$/);

        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const cert = Number(match[2]);

        if (cert < 1) {
            return null;
        }

        return { year, cert };
    }


    class SE46Series extends BaseSeries {

        constructor() {

            super("SE46", "death");

            this.dateRange = { startYear: 1973, startMonth: 0, endYear: 2014, endMonth: 0 };

            // Covers the full series including 7032-7215 (2013-2014),
            // which is MSA-guide-only and past ARCHIVE_RANGES' own end
            // of 7031 - see lookupSeries() below.
            this.seriesIdRange = { start: 1, end: 7215 };

            // Certificate search covers 1988-2014, not the whole
            // series - see lookupCertificateNumber() below (no
            // location dimension exists after 1987 at all, and
            // 1973-1987 isn't covered by certificate lookup yet).
            this.certificateSearchRange = { startYear: 1988, startMonth: 0, endYear: 2014, endMonth: 0 };

            this._decemberWorcesterNumbers = null;

            this.ARCHIVE_RANGES = [
                { start: 1, end: 1942, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-0001-1942", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                { start: 1943, end: 3234, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-001943-3234", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                { start: 3235, end: 4916, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-003235-4916", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                { start: 4917, end: 5079, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-004917-5079", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                { start: 5080, end: 5552, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-005080-5552", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                { start: 5553, end: 5976, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-005553-5976", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                // Padding drops to unpadded numbers starting exactly
                // here (SE46-6065, start of 2002) - confirmed directly
                // against a real file listing (e.g. .../msa_se46_6153/,
                // not .../msa_se46_006153/) - and stays unpadded for
                // every range after this one, through the end of
                // archive.org's 2012 coverage (SE46-7031). Only the
                // preceding range (5977-6064, still 2001) is padded.
                { start: 5977, end: 6064, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-005977-6241", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 6 },
                { start: 6065, end: 6241, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-005977-6241", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 0 },
                { start: 6242, end: 6503, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-6242-6503", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 0 },
                { start: 6504, end: 6767, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-6504-6767", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 0 },
                { start: 6768, end: 7031, collection: "reclaim-the-records-maryland-death-certificates-msa-se-46-6768-7031", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se46_", padding: 0 }
                // 7032-7215 (2013-2014) deliberately excluded - not on
                // archive.org, handled via lookupSeries()'s MSA guide
                // fallback below instead.
            ];
        }


        canHandle(location, month, year) {
            return this.inDateRange(month, year);
        }


        /**
         * 24 jurisdictions per month (23 counties plus Baltimore
         * City), strict alphabetical order, one record each by
         * default. A jurisdiction that split into multiple records
         * that month (SPLIT_MONTHS) gets however many the data shows;
         * everything else fills in around it. The record number for
         * any (jurisdiction, month) pair is computed by walking every
         * month from the start of the series, since jurisdiction
         * order is exact but individual counties' cert ranges aren't
         * known for most unsplit months - only the record NUMBER is,
         * which is all a working URL actually needs.
         *
         * A jurisdiction with a trailing special for a given month
         * (TRAILING_SPECIALS) usually consumed zero slots in that
         * month's regular sequence - its record was pulled out and
         * issued later instead - except where a special's own
         * `pulledOut` field says otherwise (Baltimore's Aug 1979
         * entry genuinely supplements a normal record). A small
         * number of confirmed-unassigned numbers (UNASSIGNED_RECORDS)
         * also consume a slot without belonging to any jurisdiction,
         * and one confirmed month (ORDER_SWAPS) breaks strict
         * alphabetical order. All three are confirmed by walking the
         * cumulative total forward from January 1973 all the way to
         * December 1987, closing exactly on Worcester = SE46-4909.
         */
        lookupLocationMonthYear(location, month, year) {

            const value = monthValue(year, month);

            if (value < GRID_DATA_START || value > GRID_DATA_END) {

                // 1988-2014 has no location or month dimension at all
                // in the source data - rather than say there's nothing
                // for this county/year (which would look identical to
                // there being no records at all), return every record
                // for the year. It's a lot of results in some cases,
                // but it tells the truth: this county's records are in
                // here somewhere, statewide, not broken out by county -
                // narrow further with a certificate number instead.
                if (year >= 1988 && year <= 2014) {
                    return allRecordsForYear(year).map(record =>
                        this.createResult({
                            year,
                            number: record.number,
                            label: `Nos. ${record.certStart}-${record.certEnd} (statewide, not narrowed by county)`,
                            url: this.archiveUrl(record.number)
                        })
                    );
                }

                return [];
            }

            const baseOrder = counties.alphabeticalCountyCityOrder();
            let cursor = 1;
            let targetParts = null;

            for (let mv = GRID_DATA_START; mv <= value; mv++) {

                const y = Math.floor((mv - 1) / 12);
                const m = mv - y * 12;
                const key = `${String(m).padStart(2, "0")}/${y}`;
                const splits = DATA.SPLIT_MONTHS[key] || {};

                const swap = DATA.ORDER_SWAPS.find(s => s.month === m && s.year === y);
                let order = baseOrder;

                if (swap) {
                    order = [...baseOrder];
                    const i1 = order.indexOf(swap.before);
                    const i2 = order.indexOf(swap.after);
                    [order[i1], order[i2]] = [order[i2], order[i1]];
                }

                for (const jurisdiction of order) {

                    const special = DATA.TRAILING_SPECIALS.find(s =>
                        s.county === jurisdiction && s.month === m && s.year === y
                    );

                    const pulledOut = special ? special.pulledOut : false;

                    const parts = splits[jurisdiction];
                    const count = pulledOut ? 0 : (parts ? parts.length : 1);

                    const assignedNumbers = [];

                    for (let i = 0; i < count; i++) {
                        cursor = nextAssignedNumber(cursor);
                        assignedNumbers.push(cursor);
                        cursor += 1;
                    }

                    if (mv === value && jurisdiction === location && count > 0) {
                        targetParts = parts
                            ? parts.map((p, i) => ({ number: assignedNumbers[i], label: p.label, certStart: p.certStart, certEnd: p.certEnd }))
                            : [{ number: assignedNumbers[0], label: null, certStart: null, certEnd: null }];
                    }
                }
            }

            const results = targetParts
                ? targetParts.map(part => {

                    let label = part.label ? `(${part.label})` : "";

                    // Confirmed for every December (1973-1987), not
                    // just the last one - Worcester's December record
                    // each year also catches late-filed certificates
                    // from earlier that year, not from the grid as a
                    // whole.
                    if (location === "Worcester" && month === 12) {
                        label = `(${DATA.WORCESTER_LATE_FILES_LABEL})`;
                    }

                    const certRange = part.certStart
                        ? part
                        : DATA.KNOWN_CERT_RANGES[part.number];

                    if (certRange) {
                        label += `${label ? " " : ""}Nos. ${certRange.certStart}-${certRange.certEnd}`;
                    }

                    return this.createResult({
                        location,
                        month,
                        year,
                        number: part.number,
                        label,
                        url: this.archiveUrl(part.number)
                    });
                })
                : [];

            // Trailing specials (SE46-4910 to 4916) are the record a
            // jurisdiction's regular slot was pulled out of for that
            // specific month (see the count=0 handling above) - there
            // should never be a regular-grid result for this same
            // (location, month, year) alongside one of these.
            const specials = DATA.TRAILING_SPECIALS.filter(s =>
                s.county === location && s.month === month && s.year === year
            );

            for (const special of specials) {
                const label = special.pulledOut
                    ? "(late-filed records, pulled from the regular sequence)"
                    : "(supplemental late-filed records)";

                results.push(this.createResult({
                    location,
                    month,
                    year,
                    number: special.number,
                    label,
                    url: this.archiveUrl(special.number)
                }));
            }

            return results;
        }


        /**
         * SE46's certificate numbers reset every year, so a bare
         * number is ambiguous - input is "YYYY-NNNNN" (e.g.
         * "1995-1234"), not a single number the way CM1132's are.
         * Only 1988-2014 resolve to anything; earlier years aren't
         * covered by a literal or formula table.
         *
         * 2013-2014 resolve to the exact record - useful even without
         * a working link, e.g. if you're at an MSA library in person -
         * but point at the MSA guide entry rather than a scanned page,
         * and carry no approximatePageUrl, since there's no scan to
         * page-jump into.
         */
        lookupCertificateNumber(input) {

            const parsed = parseYearCertificate(input);

            if (!parsed) {
                return [];
            }

            const { year, cert } = parsed;

            let record = null;

            if (year === 1988 || year === 1989) {
                record = DATA.RECORDS_1988_1989.find(r =>
                    r.year === year && cert >= r.certStart && cert <= r.certEnd
                );
            } else if (DATA.YEAR_METADATA[year]) {

                const { firstNumber, lastNumber, totalCerts } = DATA.YEAR_METADATA[year];

                if (cert > totalCerts) {
                    return [];
                }

                if (year === 1990) {
                    const exceptionEntry = Object.entries(DATA.YEAR_1990_EXCEPTIONS).find(
                        ([, range]) => cert >= range.certStart && cert <= range.certEnd
                    );

                    if (exceptionEntry) {
                        const [number, range] = exceptionEntry;
                        record = { number: Number(number), certStart: range.certStart, certEnd: range.certEnd };
                    }
                }

                if (!record) {
                    // The naive division assumes every lot is exactly
                    // 500 - true for every lot except the last one of
                    // the year, which can run longer. Clamping to
                    // lastNumber catches a certificate that falls in
                    // that overflow, rather than resolving to a lot
                    // number one past the real last one.
                    const lotIndex = Math.floor((cert - 1) / 500);
                    const number = Math.min(firstNumber + lotIndex, lastNumber);
                    const i = number - firstNumber;
                    const certStart = i * 500 + 1;
                    const certEnd = number === lastNumber ? totalCerts : certStart + 499;
                    record = { number, certStart, certEnd };
                }
            }

            if (!record) {
                return [];
            }

            if (isMsaGuideOnly(record.number)) {
                return [
                    this.createResult({
                        year,
                        number: record.number,
                        label: `Nos. ${record.certStart}-${record.certEnd}`,
                        certificateNumber: `${year}-${cert}`,
                        url: this.archiveUrl(record.number)
                    })
                ];
            }

            const url = this.archiveUrl(record.number);

            if (!url) {
                return [];
            }

            // Certificate backs were scanned through 2001 (2 pages per
            // certificate), but not from 2002 on (1 page each). Pages
            // start at 0, at the first certificate in the record.
            const backsScanned = year <= 2001;
            const position = cert - record.certStart;
            const page = position * (backsScanned ? 2 : 1);

            return [
                this.createResult({
                    year,
                    number: record.number,
                    label: `Nos. ${record.certStart}-${record.certEnd}`,
                    certificateNumber: `${year}-${cert}`,
                    url,
                    approximatePageUrl: `${url}page/n${page}/mode/1up`
                })
            ];
        }


        // Every December's Worcester record, 1973-1987 - computed once
        // by reusing lookupLocationMonthYear() directly (already has
        // the correct grid-walking logic) rather than duplicating it,
        // and cached since lookupSeries() looks this up on every call.
        get decemberWorcesterNumbers() {

            if (!this._decemberWorcesterNumbers) {

                this._decemberWorcesterNumbers = new Set();

                for (let year = 1973; year <= 1987; year++) {
                    for (const result of this.lookupLocationMonthYear("Worcester", 12, year)) {
                        this._decemberWorcesterNumbers.add(result.number);
                    }
                }
            }

            return this._decemberWorcesterNumbers;
        }


        lookupSeries(seriesId) {

            const match = seriesId
                .toUpperCase()
                .match(new RegExp(`^${this.name}-(\\d+)$`));

            if (!match) {
                return [];
            }

            const number = Number(match[1]);

            const unassignedNote = DATA.UNASSIGNED_RECORDS[number];

            if (unassignedNote) {
                return [
                    this.createResult({ number, label: unassignedNote, url: null })
                ];
            }

            // 2013-2014 (SE46-7032 to SE46-7215) were never uploaded
            // to archive.org - falls through to super.lookupSeries()
            // below, which resolves to the same MSA guide link via
            // BaseSeries.archiveUrl()'s default fallback. MSA may add
            // real scans in the future; whatever the guide page itself
            // says about availability is accurate, this library doesn't
            // add its own commentary on top.

            if (this.decemberWorcesterNumbers.has(number)) {

                const url = this.archiveUrl(number);

                if (!url) {
                    return [];
                }

                const certRange = DATA.KNOWN_CERT_RANGES[number];

                const label = certRange
                    ? `Worcester (${DATA.WORCESTER_LATE_FILES_LABEL}) Nos. ${certRange.certStart}-${certRange.certEnd}`
                    : `Worcester (${DATA.WORCESTER_LATE_FILES_LABEL})`;

                return [
                    this.createResult({ number, label, url })
                ];
            }

            return super.lookupSeries(seriesId);
        }

    }

    const instance = new SE46Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.SE46 = instance;

})(typeof window !== "undefined" ? window : globalThis);
