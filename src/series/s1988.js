if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const { alphabeticalCountyOrder, normalizeCounty } = global.MDRecordSearch.counties;

    class S1988Series extends BaseSeries {

        constructor() {

            super("S1988", "birth");

            this.dateRange = { startYear: 1910, startMonth: 5, endYear: 1913, endMonth: 12 };

            // The collection slug matches each range's starting number,
            // and the inherited buildArchiveUrl() formula builds each
            // URL from that directly - no override needed.
            this.ARCHIVE_RANGES = [
                { start: 1, end: 500, collection: "reclaim-the-records-maryland-birth-certificates-1910-1913-s-1988-1", prefix: "Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1910-1913_-_S1988-", padding: 3 },
                { start: 501, end: 999, collection: "reclaim-the-records-maryland-birth-certificates-1910-1913-s-1988-501", prefix: "Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1910-1913_-_S1988-", padding: 3 },
                // TODO: end is a provisional estimate (1012 = 44 months
                // x 23 counties, May 1910 - Dec 1913, assuming no gaps,
                // matching how the regular grid is built below), not
                // confirmed against the real final item on archive.org.
                // If the true end differs, archiveUrl() will return
                // wrong URLs for numbers past the real end, or null for
                // numbers that don't exist. Needs the URL for the last
                // file in the series (or the exact total count).
                { start: 1000, end: 1012, collection: "reclaim-the-records-maryland-birth-certificates-1910-1913-s-1988-1000", prefix: "Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1910-1913_-_S1988-", padding: 3 }
            ];
        }


        canHandle(location, month, year) {

            // Confirmed: S1988 is a county-only file - Baltimore City
            // isn't part of it (presumably handled by a separate birth
            // series, the same way CM1132/CE502 handle Baltimore City
            // deaths separately from the SE series).
            if (location === "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        buildIndex() {

            const index = {};

            let s1988 = 1;
            let year = 1910;
            let month = 5;

            while (year < 1913 || (year === 1913 && month <= 12)) {

                for (const county of alphabeticalCountyOrder()) {
                    this.addRecord(index, year, month, county, s1988);
                    s1988++;
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

    const instance = new S1988Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.S1988 = instance;

})(typeof window !== "undefined" ? window : globalThis);
