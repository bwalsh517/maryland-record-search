if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const { alphabeticalCountyOrder, normalizeCounty } = global.MDRecordSearch.counties;

    class SE45Series extends BaseSeries {

        constructor() {

            super("SE45", "death");

            this.dateRange = { startYear: 1969, startMonth: 6, endYear: 1972, endMonth: 12 };

            this.ARCHIVE_RANGES = [
                { start: 1, end: 1037, collection: "reclaim-the-records-maryland-death-certificates-msa-se-45-0001-1037", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se45_", padding: 6 }
            ];

            this.MONTH_EXCEPTION_SPLITS = {
                "1969-07-Montgomery": ["A-R", "S-Z"],
                "1969-08-Montgomery": ["A-R", "S-Z"],
                "1969-09-Montgomery": ["A-Q", "R-Z"],
                "1969-10-Montgomery": ["A-Q", "R-Z"],
                "1969-11-Baltimore": ["A-V", "N-Z"],
                "1969-11-Montgomery": ["A-P", "P-Z"],
                "1969-12-Baltimore": ["A-M", "N-Z"],
                "1969-12-Prince George's": ["A-L", "M-Z"],
                "1970-01-Baltimore": ["A-M", "N-Z"],
                "1970-02-Baltimore": ["A-L", "M-Z"],
                "1970-02-Prince George's": ["A-C", "D-Z"],
                "1970-03-Montgomery": ["A-Q", "R-Z"],
                "1970-04-Montgomery": ["A-R", "S-Z"],
                "1970-05-Baltimore": ["A-V", "W-Z"],
                "1970-05-Montgomery": ["A-R", "R-Z"],
                "1970-06-Montgomery": ["A-R", "S-Z"],
                "1970-07-Baltimore": ["A-W", "X-Z"],
                "1970-07-Montgomery": ["A-P", "R-Z"],
                "1970-08-Montgomery": ["A-M", "N-Z"],
                "1970-09-Baltimore": ["A-U", "V-Z"],
                "1970-09-Montgomery": ["A-M", "N-Z"],
                "1970-10-Baltimore": ["A-V", "W-Z"],
                "1970-10-Montgomery": ["A-R", "S-Z"],
                "1970-11-Baltimore": ["A-M", "N-Z"],
                "1970-11-Prince George's": ["A-L", "M-Z"],
                "1970-12-Baltimore": ["A-M", "N-Z"],
                "1970-12-Prince George's": ["A-G", "H-Z"],
                "1971-01-Baltimore": ["A-L", "M-Z"],
                "1971-01-Prince George's": ["A-D", "E-Z"],
                "1971-02-Baltimore": ["A-M", "N-Z"],
                "1971-02-Prince George's": ["A-K", "L-Z"],
                "1971-03-Baltimore": ["A-V", "W-Z"],
                "1971-03-Montgomery": ["A-R", "Q-Z"],
                "1971-04-Baltimore": ["A-M", "N-Z"],
                "1971-04-Prince George's": ["A-G", "H-Z"],
                "1971-05-Baltimore": ["A-M", "N-Z"],
                "1971-05-Prince George's": ["A-I", "J-Z"],
                "1971-06-Baltimore": ["A-M", "N-Z"],
                "1971-06-Prince George's": ["A-C", "D-Z"],
                "1971-07-Baltimore": ["A-L", "M-Z"],
                "1971-07-Prince George's": ["A-B", "C-Z"],
                "1971-08-Baltimore": ["A-V", "W-Z"],
                "1971-08-Montgomery": ["A-P", "Q-Z"],
                "1971-09-Baltimore": ["A-U", "V-Z"],
                "1971-09-Montgomery": ["A-L", "M-Z"],
                "1971-10-Baltimore": ["A-M", "N-Z"],
                "1971-10-Prince George's": ["A-H", "I-Z"],
                "1971-11-Baltimore": ["A-L", "M-Z"],
                "1971-11-Prince George's": ["A-E", "F-Z"],
                "1971-12-Baltimore": ["A-K", "L-Z"],
                "1971-12-Prince George's": ["A-C", "D-Z"],
                "1972-01-Baltimore": ["A-L", "M-Z"],
                "1972-01-Prince George's": ["A-G", "H-Z"],
                "1972-02-Baltimore": ["A-K", "L-Z"],
                "1972-02-Prince George's": ["A-C", "D-Z"],
                "1972-03-Baltimore": ["A-L", "M-Z"],
                "1972-03-Prince George's": ["A-F", "G-Z"],
                "1972-04-Baltimore": ["A-K", "L-Z"],
                "1972-04-Prince George's": ["A-G", "H-Z"],
                "1972-05-Montgomery": ["A-R", "S-Z"],
                "1972-06-Montgomery": ["A-P", "Q-Z"],
                "1972-07-Baltimore": ["A-M", "N-Z"],
                "1972-07-Prince George's": ["A-F", "G-Z"],
                "1972-08-Baltimore": ["A-S", "T-Z"],
                "1972-08-Montgomery": ["A-L", "M-Z"],
                "1972-09-Montgomery": ["A-P", "Q-Z"],
                "1972-10-Baltimore": ["A-K", "L-Z"],
                "1972-10-Prince George's": ["A-K", "L-Z"],
                "1972-11-Montgomery": ["A-R", "S-Z"],
                "1972-12-Baltimore": ["A-L", "M-Z"],
                "1972-12-Prince George's": ["A-C", "D-Z"]
            };
        }


        buildIndex() {

            const index = {};
            let se45 = 1;
            let year = 1969;
            let month = 7;

            while (year < 1973) {

                const entries = this.monthEntries(year, month);

                for (const [county, label] of entries) {
                    this.addRecord(index, year, month, county, se45, label);
                    se45++;
                }

                month++;
                if (month === 13) {
                    month = 1;
                    year++;
                }
            }

            return index;
        }


        addRecord(index, year, month, county, se45, label) {

            const key = `${year}-${month}-${county}`;

            if (!index[key]) {
                index[key] = [];
            }

            index[key].push({ se45, label });
        }


        monthEntries(year, month) {

            const counties = alphabeticalCountyOrder();
            const output = [];

            for (const county of counties) {

                const key = `${year}-${String(month).padStart(2, "0")}-${county}`;

                if (this.MONTH_EXCEPTION_SPLITS[key]) {
                    for (const label of this.MONTH_EXCEPTION_SPLITS[key]) {
                        output.push([county, label]);
                    }
                } else {
                    output.push([county, null]);
                }
            }

            return output;
        }


        canHandle(location, month, year) {

            if (location === "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
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
                    number: record.se45,
                    label: record.label || "",
                    url: this.archiveUrl(record.se45)
                })
            );
        }

    }

    const instance = new SE45Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.SE45 = instance;

})(typeof window !== "undefined" ? window : globalThis);
