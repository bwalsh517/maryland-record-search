if (typeof require !== "undefined") {
    require("../core/base-series.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;

    class CE502Series extends BaseSeries {

        constructor() {

            super("CE502", "death");

            this.dateRange = { startYear: 1950, startMonth: 0, endYear: 1972, endMonth: 0 };

            this.ARCHIVE_RANGES = [
                { start: 1, end: 94, collection: "reclaim-the-records-baltimore-city-death-certificates-msa-ce-502-000001-94", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_ce502_", padding: 6 },
                { start: 95, end: 387, collection: "reclaim-the-records-baltimore-city-death-certificates-msa-ce-502-000095-387", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_ce502_", padding: 6 },
                { start: 388, end: 523, collection: "reclaim-the-records-baltimore-city-death-certificates-msa-ce-502-000388-523", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_ce502_", padding: 6 },
                { start: 524, end: 600, collection: "reclaim-the-records-baltimore-city-death-certificates-msa-ce-502-000524-600", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_ce502_", padding: 6 }
            ];
        }

        // NOTE: location/date search is not implemented for CE502 yet -
        // only direct series-ID lookup works today.
        canHandle(location, month, year) {

            if (location !== "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }

    }

    const instance = new CE502Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.CE502 = instance;

})(typeof window !== "undefined" ? window : globalThis);
