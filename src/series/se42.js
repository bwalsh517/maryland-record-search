if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const { BASE_COUNTIES, normalizeCounty } = global.MDRecordSearch.counties;

    class SE42Series extends BaseSeries {

        constructor() {

            super("SE42", "death");

            this.dateRange = { startYear: 1898, startMonth: 5, endYear: 1910, endMonth: 4 };

            this.seriesIdRange = { start: 1, end: 3298 };

            this.ARCHIVE_RANGES = [
                { start: 1, end: 47, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-001-47", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 49, end: 498, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-049-500", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 499, end: 997, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-499-997", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 998, end: 1548, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-998-1548", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 1549, end: 1824, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-1549-1824", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 1825, end: 2376, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-1825-2376", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 2377, end: 3204, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-2377-3204", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 },
                { start: 3205, end: 3298, collection: "reclaim-the-records-maryland-death-certificates-1898-1910-msa-se-42-3205-3298", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1898-1910_-_msa_se42_-_", padding: 5 }
            ];

            // Records 1-21 are a special early case still not broken
            // out by county/month - only direct series-ID lookup works
            // for that range today. Records 22-62 (May-Jul 1898) are
            // known but don't follow the regular rotation order below,
            // so they're listed explicitly in LEADING_SPECIALS instead.
            this.FIRST_BLOCK_UNINDEXED = 21;

            this.LEADING_SPECIALS = [
                { number: 22, year: 1898, month: 5, county: "Baltimore" },
                { number: 23, year: 1898, month: 5, county: "Dorchester" },
                { number: 24, year: 1898, month: 5, county: "Frederick" },
                { number: 25, year: 1898, month: 5, county: "Harford" },
                { number: 26, year: 1898, month: 5, county: "Prince George's" },
                { number: 27, year: 1898, month: 5, county: "Talbot" },
                { number: 28, year: 1898, month: 6, county: "Anne Arundel" },
                { number: 29, year: 1898, month: 6, county: "Allegany" },
                { number: 30, year: 1898, month: 6, county: "Baltimore" },
                { number: 31, year: 1898, month: 6, county: "Cecil" },
                { number: 32, year: 1898, month: 6, county: "Carroll" },
                { number: 33, year: 1898, month: 6, county: "Dorchester" },
                { number: 34, year: 1898, month: 6, county: "Frederick" },
                { number: 35, year: 1898, month: 6, county: "Garrett" },
                { number: 36, year: 1898, month: 6, county: "Kent" },
                { number: 37, year: 1898, month: 6, county: "Montgomery" },
                { number: 38, year: 1898, month: 6, county: "Prince George's" },
                { number: 39, year: 1898, month: 6, county: "Queen Anne's" },
                { number: 40, year: 1898, month: 6, county: "Somerset" },
                { number: 41, year: 1898, month: 6, county: "Talbot" },
                { number: 42, year: 1898, month: 7, county: "Anne Arundel" },
                { number: 43, year: 1898, month: 7, county: "Allegany" },
                { number: 44, year: 1898, month: 7, county: "Baltimore" },
                { number: 45, year: 1898, month: 7, county: "Caroline" },
                { number: 46, year: 1898, month: 7, county: "Cecil" },
                { number: 47, year: 1898, month: 7, county: "Charles" },
                { number: 48, year: 1898, month: 7, county: "Carroll" },
                { number: 49, year: 1898, month: 7, county: "Calvert" },
                { number: 50, year: 1898, month: 7, county: "Dorchester" },
                { number: 51, year: 1898, month: 7, county: "Frederick" },
                { number: 52, year: 1898, month: 7, county: "Garrett" },
                { number: 53, year: 1898, month: 7, county: "Harford" },
                { number: 54, year: 1898, month: 7, county: "Howard" },
                { number: 55, year: 1898, month: 7, county: "Kent" },
                { number: 56, year: 1898, month: 7, county: "Montgomery" },
                { number: 57, year: 1898, month: 7, county: "Prince George's" },
                { number: 58, year: 1898, month: 7, county: "Queen Anne's" },
                { number: 59, year: 1898, month: 7, county: "Talbot" },
                { number: 60, year: 1898, month: 7, county: "Washington" },
                { number: 61, year: 1898, month: 7, county: "Wicomico" },
                { number: 62, year: 1898, month: 7, county: "Worcester" }
            ];

            // (county, month) combinations known to be missing from the
            // regular rotation - these counties simply have no filing
            // for that month, so the number sequence skips straight to
            // the next county without them. This is what closes the
            // 9-record gap between a plain 23-county x 141-month grid
            // and the archival record: without this table, Worcester/
            // Apr 1910 computes as SE42-3305 instead of the correct
            // SE42-3296.
            this.MISSING_FROM_ROTATION = {
                "1900-06-Calvert": true,
                "1900-01-Charles": true,
                "1900-05-Charles": true,
                "1900-07-Charles": true,
                "1900-08-Charles": true,
                "1900-12-Somerset": true,
                "1901-05-Saint Mary's": true,
                "1901-06-Saint Mary's": true,
                "1903-03-Talbot": true
            };

            // Trailing special-case records, filed out of chronological
            // order after the main rotation - same pattern as SE43's
            // YEAR_EXCEPTION_SPECIAL (e.g. Garrett 1928).
            this.TRAILING_SPECIALS = [
                { number: 3297, year: 1898, month: 5, county: "Washington" },
                { number: 3298, year: 1898, month: 6, county: "Washington" }
            ];
        }


        canHandle(location, month, year) {

            if (location === "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        buildIndex() {

            const index = {};

            for (const record of this.LEADING_SPECIALS) {
                this.addRecord(index, record.year, record.month, record.county, record.number);
            }

            let se42 = 63;
            let year = 1898;
            let month = 8;

            while (year < 1910 || (year === 1910 && month <= 4)) {

                for (const county of BASE_COUNTIES) {

                    const key = `${year}-${String(month).padStart(2, "0")}-${county}`;

                    if (this.MISSING_FROM_ROTATION[key]) {
                        continue;
                    }

                    this.addRecord(index, year, month, county, se42);
                    se42++;
                }

                month++;
                if (month === 13) {
                    month = 1;
                    year++;
                }
            }

            for (const record of this.TRAILING_SPECIALS) {
                this.addRecord(index, record.year, record.month, record.county, record.number);
            }

            return index;
        }


        addRecord(index, year, month, county, number) {

            const key = `${year}-${month}-${county}`;

            if (!index[key]) {
                index[key] = [];
            }

            index[key].push({ number });
        }


        lookupLocationMonthYear(location, month, year) {

            const county = normalizeCounty(location);
            const records = this.index[`${year}-${month}-${county}`];

            if (!records) {
                return [];
            }

            return records.map(record =>
                this.createResult({
                    location: county,
                    year,
                    month,
                    number: record.number,
                    url: this.archiveUrl(record.number)
                })
            );
        }

    }

    const instance = new SE42Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.SE42 = instance;

})(typeof window !== "undefined" ? window : globalThis);
