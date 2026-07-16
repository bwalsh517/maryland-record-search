if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("./cm1135-data.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const DATA = global.MDRecordSearch.CM1135_DATA;

    function formatRecordDateRange(date) {

        const start = `${String(date.startMonth).padStart(2, "0")}/${date.startYear}`;

        if (date.startYear === date.endYear && date.startMonth === date.endMonth) {
            return start;
        }

        const end = `${String(date.endMonth).padStart(2, "0")}/${date.endYear}`;

        return `${start}-${end}`;
    }


    /**
     * "[YYYY-]LETTER?NUMBER[SUFFIX]" - e.g. "A50000", "1909-A50000",
     * "G33501D", "L609". The year prefix is optional and only useful
     * for disambiguating a letter that was reused (see cm1135-data.js's
     * header comment) - a query without it can and will match more
     * than one record. "L" numbers are a completely separate namespace
     * (the lost-number sets, see lookupCertificateNumber() below), not
     * part of the main A-G letter cycle.
     */
    function parseCertQuery(input) {

        const raw = String(input || "").trim().toUpperCase();
        const match = raw.match(/^(?:(\d{4})-)?([A-GL]?)(\d+)([A-Z]?)$/);

        if (!match) {
            return null;
        }

        const [, yearStr, letter, numStr, suffix] = match;

        return {
            year: yearStr ? Number(yearStr) : null,
            letter: letter || "",
            number: Number(numStr),
            suffix: suffix || null
        };
    }


    class CM1135Series extends BaseSeries {

        constructor() {

            super("CM1135", "birth");

            // Years only given (1875-1972), no specific start/end month -
            // 0 means "just a year" per BaseSeries.inDateRange(). This is
            // the series' full declared span; the transcribed data below
            // only covers CM1135-1 through CM1135-322 (through 12/1947) -
            // the series switches to the "YYYY-NNNNN" certificate format
            // after that, same convention SE46/CE502 use from 1988/1950
            // on respectively. CM1135-323 through 670 (1948-1972) aren't
            // transcribed yet.
            this.dateRange = { startYear: 1875, startMonth: 0, endYear: 1972, endMonth: 0 };

            this.seriesIdRange = { start: 1, end: 670 };

            // Certificate-number search only covers what's actually
            // transcribed (through CM1135-322/12-1947) - narrower than
            // dateRange above, same pattern SE46 uses for its own partial
            // certificate coverage.
            this.certificateSearchRange = { startYear: 1875, startMonth: 1, endYear: 1947, endMonth: 12 };

            // Standard 50-file-per-collection range table, same shape
            // as CM1132/CE502 - no archiveUrl() override needed for
            // this portion. CM1135-151 through CM1135-670 have no
            // archive.org scan at all, so BaseSeries.archiveUrl()'s
            // default MSA fallback handles them automatically - nothing
            // else to declare here.
            this.ARCHIVE_RANGES = [
                { start: 1, end: 50, collection: "reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-001", prefix: "Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-", padding: 3 },
                { start: 51, end: 100, collection: "reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-051", prefix: "Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-", padding: 3 },
                { start: 101, end: 150, collection: "reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-101", prefix: "Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-", padding: 3 }
            ];
        }


        canHandle(location, month, year) {

            if (location !== "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        /**
         * Every DATE_CERT_RECORDS entry's dates live under `dateParts` -
         * a one-element list for an ordinary record, two elements for
         * CM1135-113 (see cm1135-data.js) - so this loop handles both
         * without a special case. Each part that covers the query month
         * becomes its own result, carrying that part's own `part` id so
         * lookupYear()'s dedup keeps CM1135-113's two spans separate
         * instead of collapsing them into one.
         *
         * The lost-number sets (CM1135-25 through 29) are checked
         * separately and always appended after the main matches, sorted
         * narrowest year-span first - a query year sitting inside all
         * five of them (they overlap each other) is far more likely to
         * belong to the main-sequence record than to a decade-spanning
         * lost batch, and among the lost batches themselves the
         * narrowest one is the better first guess.
         *
         * Lost-set results echo back the query month rather than using
         * month: null, even though the actual month is genuinely
         * unknown - month: null means "confirmed whole-year coverage"
         * everywhere else in this library (SM35, SE46 1988-2014), and
         * that's not true here. It also matters mechanically: some
         * months (e.g. Jan-Apr 1888) have zero main-sequence coverage
         * at all - the lost sets briefly replaced normal filing then -
         * so a month: null lost-only result would wrongly look
         * "this series doesn't vary by month" to lookupYear()'s
         * per-series shortcut and cause it to stop querying CM1135 for
         * the rest of the year, silently dropping every later month's
         * real main-sequence record. Echoing the query month keeps
         * every month's call looking month-varying, which it genuinely
         * is once the main sequence is considered.
         */
        lookupLocationMonthYear(location, month, year) {

            if (location !== "Baltimore City") {
                return [];
            }

            const value = year * 100 + month;
            const mainMatches = [];

            for (const record of DATA.DATE_CERT_RECORDS) {

                for (const datePart of record.dateParts) {

                    const start = datePart.date.startYear * 100 + (datePart.date.startMonth || 1);
                    const end = datePart.date.endYear * 100 + (datePart.date.endMonth || 12);

                    if (value < start || value > end) {
                        continue;
                    }

                    mainMatches.push(this.createResult({
                        location: "Baltimore City",
                        year,
                        month,
                        number: record.number,
                        part: datePart.part,
                        label: `${formatRecordDateRange(datePart.date)} ${record.label}`,
                        url: this.archiveUrl(record.number)
                    }));
                }
            }

            const lostMatches = DATA.LOST_NUMBER_RECORDS
                .filter(record => year >= record.startYear && year <= record.endYear)
                .sort((a, b) => (a.endYear - a.startYear) - (b.endYear - b.startYear))
                .map(record => this.createResult({
                    location: "Baltimore City",
                    year,
                    month,
                    number: record.number,
                    sortWeight: 1,
                    label: `${record.startYear}-${record.endYear} (lost number set, uncertain date within range) ${record.label}`,
                    url: this.archiveUrl(record.number)
                }));

            return [...mainMatches, ...lostMatches];
        }


        /**
         * Unlike CM1132, letters here are NOT one continuous sequence -
         * "A" and "B" each cycle through the full 1-100000 range twice
         * before C-G (so far), so a bare letter+number is genuinely
         * ambiguous and this returns every record whose segment contains
         * it (see cm1135-data.js's header comment). An optional "YYYY-"
         * prefix narrows to record(s) whose date actually covers that
         * year. A trailing suffix (e.g. the "D" in "G33501D") only
         * matters at the exact boundary number it was transcribed on -
         * querying with it narrows to that boundary; querying without it
         * matches regardless, same as CE502's confirmed "3000"/"3000A"
         * duplicate-certificate handling.
         *
         * "L" numbers are a separate, non-overlapping namespace (the
         * lost-number sets) and always resolve to exactly one record.
         */
        lookupCertificateNumber(input) {

            const parsed = parseCertQuery(input);

            if (!parsed) {
                return [];
            }

            const { year, letter, number, suffix } = parsed;

            if (letter === "L") {

                const record = DATA.LOST_NUMBER_RECORDS.find(r =>
                    number >= r.start && number <= r.end
                );

                if (!record) {
                    return [];
                }

                if (year !== null && (year < record.startYear || year > record.endYear)) {
                    return [];
                }

                const url = this.archiveUrl(record.number);

                if (!url) {
                    return [];
                }

                return [
                    this.createResult({
                        location: "Baltimore City",
                        year: record.startYear,
                        number: record.number,
                        label: `${record.startYear}-${record.endYear} (lost number set, uncertain date within range) ${record.label}`,
                        certificateNumber: `L${String(number).padStart(5, "0")}`,
                        url
                    })
                ];
            }

            const results = [];

            for (const record of DATA.DATE_CERT_RECORDS) {

                for (const segment of record.segments) {

                    if (segment.letter !== letter) {
                        continue;
                    }

                    if (number < segment.start || number > segment.end) {
                        continue;
                    }

                    if (suffix) {
                        const boundarySuffix =
                            number === segment.start ? segment.startSuffix :
                                number === segment.end ? segment.endSuffix : null;

                        if (boundarySuffix !== suffix) {
                            continue;
                        }
                    }

                    if (year !== null) {
                        const inYear = record.dateParts.some(datePart =>
                            year >= datePart.date.startYear && year <= datePart.date.endYear
                        );

                        if (!inYear) {
                            continue;
                        }
                    }

                    const url = this.archiveUrl(record.number);

                    if (!url) {
                        continue;
                    }

                    const matchedPart =
                        record.dateParts.find(datePart =>
                            year !== null
                                ? year >= datePart.date.startYear && year <= datePart.date.endYear
                                : true
                        ) || record.dateParts[0];

                    const boundarySuffix =
                        number === segment.start ? segment.startSuffix :
                            number === segment.end ? segment.endSuffix : null;

                    results.push(this.createResult({
                        location: "Baltimore City",
                        year: matchedPart.date.startYear,
                        month: record.multipart ? null : matchedPart.date.startMonth,
                        number: record.number,
                        part: matchedPart.part,
                        label: record.multipart
                            ? `${record.label} (multipart record, see MSA guide for exact date)`
                            : segment.isGapEstimate
                                ? `${record.label} (estimated range, not independently confirmed - see MSA guide)`
                                : record.label,
                        certificateNumber: `${segment.letter}${number}${boundarySuffix || ""}`,
                        url,
                        // Page-jump math (a la CM1132/CE502) hasn't been confirmed
                        // for this series - deliberately left unset rather than
                        // guessing at a certs-per-page ratio.
                        approximatePageUrl: null
                    }));

                    break;
                }
            }

            return results;
        }

    }

    const instance = new CM1135Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.CM1135 = instance;

})(typeof window !== "undefined" ? window : globalThis);
