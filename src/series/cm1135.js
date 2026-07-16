if (typeof require !== "undefined") {
    require("../core/base-series.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;

    class CM1135Series extends BaseSeries {

        constructor() {

            super("CM1135", "birth");

            // Years only given (1875-1972), no specific start/end month -
            // 0 means "just a year" per BaseSeries.inDateRange().
            this.dateRange = { startYear: 1875, startMonth: 0, endYear: 1972, endMonth: 0 };

            this.seriesIdRange = { start: 1, end: 670 };

            // Standard 50-file-per-collection range table, same shape
            // as CM1132/CE502 - no archiveUrl() override needed for
            // this portion.
            this.ARCHIVE_RANGES = [
                { start: 1, end: 50, collection: "reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-001", prefix: "Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-", padding: 3 },
                { start: 51, end: 100, collection: "reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-051", prefix: "Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-", padding: 3 },
                { start: 101, end: 150, collection: "reclaim-the-records-baltimore-maryland-birth-certificates-1875-1922-cm-1135-101", prefix: "Reclaim_The_Records_-_Baltimore_Maryland_Birth_Certificates_-_1875-1922_-_CM1135-", padding: 3 }
            ];

            // CM1135-151 through CM1135-670 are hosted on the MSA guide
            // instead of archive.org and follow a simple formula - see
            // archiveUrl() override below.
            this.MSA_GUIDE_RANGE = { start: 151, end: 670 };
        }


        canHandle(location, month, year) {

            if (location !== "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        archiveUrl(number) {

            const { start, end } = this.MSA_GUIDE_RANGE;

            if (number >= start && number <= end) {
                return `https://guide.msa.maryland.gov/pages/item.aspx?ID=CM1135-${number}`;
            }

            return super.archiveUrl(number);
        }

    }

    const instance = new CM1135Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.CM1135 = instance;

})(typeof window !== "undefined" ? window : globalThis);
