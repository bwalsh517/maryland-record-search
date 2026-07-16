if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const { alphabeticalCountyOrder, normalizeCounty } = global.MDRecordSearch.counties;

    class SE44Series extends BaseSeries {

        constructor() {

            super("SE44", "death");

            this.dateRange = { startYear: 1951, startMonth: 7, endYear: 1969, endMonth: 6 };

            this.seriesIdRange = { start: 1, end: 5021 };

            this.MONTH_EXCEPTION_SPLITS = {
                "1954-12-Montgomery": ["A-J", "K-Z"],
                "1955-02-Montgomery": ["A-Q", "R-Z"],
                "1963-10-Montgomery": ["A-J", "K-Z"],
                "1965-01-Montgomery": ["A-R", "S-Z"],
                "1965-03-Montgomery": ["A-M", "N-Z"],
                "1965-12-Montgomery": ["A-M", "N-Z"],
                "1966-01-Montgomery": ["A-R", "S-Z"],
                "1966-02-Montgomery": ["A-P", "R-Z"],
                "1966-03-Montgomery": ["A-M", "N-Z"],
                "1966-04-Montgomery": ["A-R", "S-Z"],
                "1966-05-Montgomery": ["A-P", "R-Z"],
                "1966-06-Montgomery": ["A-P", "R-Z"],
                "1966-07-Montgomery": ["A-P", "Q-Z"],
                "1966-08-Montgomery": ["A-Q", "R-Z"],
                "1966-09-Montgomery": ["A-O", "P-Z"],
                "1966-10-Montgomery": ["A-Q", "R-Z"],
                "1966-11-Montgomery": ["A-M", "N-Z"],
                "1966-12-Montgomery": ["A-R", "S-Z"],
                "1967-01-Montgomery": ["A-Q", "R-Z"],
                "1967-02-Montgomery": ["A-R", "S-Z"],
                "1967-03-Montgomery": ["A-Q", "R-Z"],
                "1967-04-Montgomery": ["A-R", "S-Z"],
                "1967-05-Montgomery": ["A-R", "S-Z"],
                "1967-06-Montgomery": ["A-L", "M-Z"],
                "1967-07-Montgomery": ["A-Q", "R-Z"],
                "1967-08-Montgomery": ["A-P", "Q-Z"],
                "1967-09-Montgomery": ["A-M", "N-Z"],
                "1967-10-Montgomery": ["A-P", "Q-Z"],
                "1967-11-Montgomery": ["A-M", "N-Z"],
                "1967-12-Montgomery": ["A-M", "N-Z"],
                "1968-01-Baltimore": ["A-M", "N-Z"],
                "1968-01-Prince George's": ["A-G", "H-Z"],
                "1968-02-Montgomery": ["A-Q", "R-Z"],
                "1968-03-Baltimore": ["A-M", "N-Z"],
                "1968-03-Prince George's": ["A-G", "H-Z"],
                "1968-04-Montgomery": ["A-N", "O-Z"],
                "1968-05-Montgomery": ["A-Q", "R-Z"],
                "1968-06-Montgomery": ["A-P", "Q-Z"],
                "1968-07-Baltimore": ["A-M", "N-Z"],
                "1968-08-Montgomery": ["A-M", "N-Z"],
                "1968-09-Montgomery": ["A-P", "R-Z"],
                "1968-10-Montgomery": ["A-M", "N-Z"],
                "1968-11-Montgomery": ["A-P", "Q-Z"],
                "1968-12-Baltimore": ["A-M", "N-Z"],
                "1969-01-Baltimore": ["A-K", "L-Z"],
                "1969-01-Prince George's": ["A-C", "D-Z"],
                "1969-01-Saint Mary's": ["", "No File"],
                "1969-02-Montgomery": ["A-P", "Q-Z"],
                "1969-03-Baltimore": ["A-O", "P-Z"],
                "1969-03-Prince George's": ["A-E", "F-Z"],
                "1969-04-Montgomery": ["A-Q", "R-Z"],
                "1969-05-Montgomery": ["A-R", "S-Z"],
                "1969-06-Montgomery": ["A-S", "T-Z"]
            };
        }


        canHandle(location, month, year) {

            if (location === "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        buildIndex() {

            const index = {};
            let se44 = 1;
            let year = 1951;
            let month = 7;

            while (year < 1969 || (year === 1969 && month <= 6)) {

                for (const county of alphabeticalCountyOrder()) {

                    const key = `${year}-${String(month).padStart(2, "0")}-${county}`;
                    const splits = this.MONTH_EXCEPTION_SPLITS[key];

                    if (splits) {
                        for (const label of splits) {
                            this.addRecord(index, year, month, county, se44, label);
                            se44++;
                        }
                    } else {
                        this.addRecord(index, year, month, county, se44, null);
                        se44++;
                    }
                }

                month++;
                if (month === 13) {
                    month = 1;
                    year++;
                }
            }

            return index;
        }


        addRecord(index, year, month, county, number, label) {

            const key = `${year}-${month}-${county}`;

            if (!index[key]) {
                index[key] = [];
            }

            index[key].push({ number, label });
        }


        // SE44 file numbers are grouped into archive.org items in blocks
        // of 1000, so this is a computed formula rather than a lookup
        // table like the other series - kept as its own override.
        archiveUrl(number) {

            let start;

            if (number <= 1000) {
                start = 1;
            } else {
                start = Math.floor((number - 1) / 1000) * 1000 + 1;
            }

            return (
                "https://archive.org/details/" +
                "reclaim-the-records-maryland-death-certificates-" +
                `msa-se-44-${String(start).padStart(6, "0")}/` +
                "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se44_" +
                String(number).padStart(6, "0") +
                "/"
            );
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
                    label: record.label || "",
                    url: this.archiveUrl(record.number)
                })
            );
        }

    }

    const instance = new SE44Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.SE44 = instance;

})(typeof window !== "undefined" ? window : globalThis);
