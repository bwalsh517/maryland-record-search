if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const { alphabeticalCountyOrder, normalizeCounty } = global.MDRecordSearch.counties;

    class S1963Series extends BaseSeries {

        constructor() {

            super("S1963", "birth");

            this.dateRange = { startYear: 1898, startMonth: 8, endYear: 1910, endMonth: 4 };

            this.seriesIdRange = { start: 1, end: 3265 };

            // S1963-1 through S1963-22 are a special early case, linked
            // directly via the MSA guide rather than archive.org - series-ID
            // lookup only, no county/month breakdown given.
            this.LEADING_SPECIAL_RANGE = { start: 1, end: 22 };

            // These numbers are real, valid entries in the regular
            // rotation below (confirmed: a plain 23-county alphabetical
            // grid starting at 23 lands on every one of these exactly)
            // but no scan exists for them - "No cards are extant for
            // this month and county" per the finding aid. They still
            // consume a series number, unlike SE42's missing-rotation
            // gaps (which skip the number entirely) - so these show up
            // in both location/date and series-ID search with the
            // finding aid's note and a null url, rather than being
            // silently absent.
            this.NO_FILE_RECORDS = {
                40: { year: 1898, month: 8, county: "Saint Mary's", note: "No cards are extant for this month and county" },
                41: { year: 1898, month: 8, county: "Somerset", note: "No cards are extant for this month and county" },
                45: { year: 1898, month: 8, county: "Worcester", note: "No cards are extant for this month and county" },
                64: { year: 1898, month: 9, county: "Somerset", note: "No cards are extant for this month and county" },
                68: { year: 1898, month: 9, county: "Worcester", note: "No cards are extant for this month and county" },
                111: { year: 1898, month: 11, county: "Talbot", note: "No cards are extant for this month and county" },
                114: { year: 1898, month: 11, county: "Worcester", note: "No cards are extant for this month and county" },
                852: { year: 1901, month: 8, county: "Anne Arundel", note: "No cards are extant for this month and county" },
                2662: { year: 1908, month: 2, county: "Saint Mary's", note: "No cards are extant for this month and county" },
                2915: { year: 1909, month: 1, county: "Saint Mary's", note: "No cards are extant for this month and county" },
                2961: { year: 1909, month: 3, county: "Saint Mary's", note: "No cards are extant for this month and county" }
            };

            // Archive.org files these in shared blocks (like CM1132 and
            // S1988), not one item per record - confirmed against the
            // actual collections. Block 2001-3000 is filed under
            // "2346" instead of "2001"; every other block's collection
            // name matches its own start number.
            this.ARCHIVE_RANGES = [
                { start: 23, end: 1000, collection: "reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-0023" },
                { start: 1001, end: 2000, collection: "reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-1001" },
                { start: 2001, end: 3000, collection: "reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-2346" },
                { start: 3001, end: 3265, collection: "reclaim-the-records-maryland-birth-certificates-1898-1910-s-1963-3001" }
            ];
        }


        canHandle(location, month, year) {

            // Confirmed: S1963 is a county-only file, same as S1988 and
            // SM35 - Baltimore City births are handled by a separate
            // series.
            if (location === "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        buildIndex() {

            const index = {};

            let s1963 = 23;
            let year = 1898;
            let month = 8;

            while (year < 1910 || (year === 1910 && month <= 4)) {

                for (const county of alphabeticalCountyOrder()) {
                    this.addRecord(index, year, month, county, s1963);
                    s1963++;
                }

                month++;
                if (month === 13) {
                    month = 1;
                    year++;
                }
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

            return records.map(record => {

                const noFile = this.NO_FILE_RECORDS[record.number];

                return this.createResult({
                    location: county,
                    year,
                    month,
                    number: record.number,
                    label: noFile ? noFile.note : "",
                    url: noFile ? null : this.archiveUrl(record.number)
                });
            });
        }


        // Overridden (not just archiveUrl) so a "no file" number returns
        // an informative result (with the finding aid's note) instead of
        // an empty array indistinguishable from an invalid record number.
        lookupSeries(seriesId) {

            const match = seriesId.toUpperCase().match(/^S1963-(\d+)$/);

            if (!match) {
                return [];
            }

            const number = Number(match[1]);
            const noFile = this.NO_FILE_RECORDS[number];

            if (noFile) {
                return [
                    this.createResult({
                        number,
                        year: noFile.year,
                        month: noFile.month,
                        location: noFile.county,
                        label: noFile.note,
                        url: null
                    })
                ];
            }

            return super.lookupSeries(seriesId);
        }


        // Full override, not buildArchiveUrl/BaseSeries.archiveUrl() -
        // no-file numbers have no URL at all, and archive.org's block
        // boundaries here don't line up with any padding-based formula.
        archiveUrl(number) {

            const { start, end } = this.LEADING_SPECIAL_RANGE;

            // No archive.org scan exists for this early block - defer
            // to BaseSeries.archiveUrl()'s default MSA fallback rather
            // than hand-building the same link here.
            if (number >= start && number <= end) {
                return super.archiveUrl(number);
            }

            if (this.NO_FILE_RECORDS[number]) {
                return null;
            }

            const range = this.ARCHIVE_RANGES.find((r) => number >= r.start && number <= r.end);

            if (!range) {
                return super.archiveUrl(number);
            }

            const padded = String(number).padStart(4, "0");

            return (
                "https://archive.org/details/" +
                range.collection +
                "/" +
                `Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1898-1910_-_S1963-${padded}` +
                "/"
            );
        }

    }

    const instance = new S1963Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.S1963 = instance;

})(typeof window !== "undefined" ? window : globalThis);
