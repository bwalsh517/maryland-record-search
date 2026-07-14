if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const { BASE_COUNTIES, alphabeticalCountyOrder, normalizeCounty } = global.MDRecordSearch.counties;

    class SE43Series extends BaseSeries {

        constructor() {

            super("SE43", "death");

            this.dateRange = { startYear: 1910, startMonth: 5, endYear: 1951, endMonth: 6 };

            this.ARCHIVE_RANGES = [
                { start: 1, end: 736, collection: "reclaim-the-records-maryland-death-certificates-1910-1921-msa-se-43-001-736", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1910-1921_-_msa_se43_-_", padding: 5 },
                { start: 737, end: 1564, collection: "reclaim-the-records-maryland-death-certificates-1910-1921-msa-se-43-737-1564", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1910-1921_-_msa_se43_-_", padding: 5 },
                { start: 1565, end: 2394, collection: "reclaim-the-records-maryland-death-certificates-1910-1921-msa-se-43-1565-2394", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1910-1921_-_msa_se43_-_", padding: 5 },
                { start: 2395, end: 3222, collection: "reclaim-the-records-maryland-death-certificates-1910-1921-msa-se-43-2395-3222", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1910-1921_-_msa_se43_-_", padding: 5 },
                { start: 3223, end: 3475, collection: "reclaim-the-records-maryland-death-certificates-1910-1922-msa-se-43-3223-3475", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_1910-1922_-_msa_se43_-_", padding: 5 },
                { start: 3476, end: 3807, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-003476-3807", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 3808, end: 3986, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-003808-3986", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 3987, end: 4848, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-003808-4848", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 4849, end: 5952, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-004849-5952", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 5953, end: 6780, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-005953-6780", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 6781, end: 7884, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-006781-7884", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 7885, end: 8988, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-007885-8988", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 8989, end: 9540, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-008989-9540", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 },
                { start: 9541, end: 9679, collection: "reclaim-the-records-maryland-death-certificates-msa-se-43-009541-9679", prefix: "Reclaim_The_Records_-_Maryland_Death_Certificates_-_msa_se43_", padding: 6 }
            ];

            this.YEAR_EXCEPTION_SPLITS = {
                1924: {
                    "Allegany": ["A-F", "G-M", "N-Z"],
                    "Anne Arundel": ["A-I", "J-Z"],
                    "Baltimore": ["A-J", "K-Z"],
                    "Carroll": ["A-D", "E-Z"],
                    "Frederick": ["A-L", "M-Z"],
                    "Garrett": ["A-L", "M-Z"],
                    "Talbot": ["A-K", "L-Z"],
                    "Washington": ["A-G", "H-Z"],
                    "Wicomico": ["A-S", "T-Z"]
                },
                1925: {
                    "Allegany": ["A-L", "M-Z"],
                    "Anne Arundel": ["A-K", "L-Z"],
                    "Baltimore": ["A-C", "D-M", "N-Z"],
                    "Frederick": ["A-N", "O-Z"],
                    "Talbot": ["A-J", "K-Z"],
                    "Washington": ["A-H", "I-Z"]
                },
                1926: {
                    "Allegany": ["A-Mc", "Ma-Z"],
                    "Anne Arundel": ["A-J", "K-Z"],
                    "Baltimore": ["A-G", "H-Q", "R-Z"],
                    "Carroll": ["A-J", "K-Z"],
                    "Dorchester": ["A-H", "I-Z"],
                    "Frederick": ["A-L", "M-Z"],
                    "Harford": ["A-I", "J-Z"],
                    "Montgomery": ["A-F", "G-Z"],
                    "Prince George's": ["A-M", "N-Z"],
                    "Talbot": ["A-P", "Q-Z"],
                    "Washington": ["A-G", "H-P", "Q-Z"],
                    "Wicomico": ["A-D", "E-Z"]
                },
                1927: {
                    "Allegany": ["A-L", "M-Z"],
                    "Anne Arundel": ["A-L", "M-Z"],
                    "Baltimore": ["A-F", "G-M", "N-Z"],
                    "Carroll": ["A-M", "N-Z"],
                    "Cecil": ["A-L", "M-Z"],
                    "Frederick": ["A-K", "L-Z"],
                    "Harford": ["A-O", "P-Z"],
                    "Prince George's": ["A-P", "Q-Z"],
                    "Talbot": ["A-P", "Q-Z"],
                    "Washington": ["A-J", "K-Z"]
                },
                1928: {
                    "Allegany": ["A-J", "K-S", "T-Z"],
                    "Anne Arundel": ["A-I", "J-Z"],
                    "Baltimore": ["A-G", "H-Q", "R-Z"],
                    "Carroll": ["A-G", "H-Z"],
                    "Cecil": ["A-D", "E-Z"],
                    "Charles": ["A-R", "S-Z"],
                    "Dorchester": ["A-R", "S-Z"],
                    "Frederick": ["A-G", "H-T", "U-Z"],
                    "Harford": ["A-H", "I-Z"],
                    "Montgomery": ["A-L", "M-Z"],
                    "Prince George's": ["A-F", "G-Z"],
                    "Queen Anne's": ["A-O", "P-Z"],
                    "Somerset": ["A-H", "I-Z"],
                    "Washington": ["A-L", "M-Z"],
                    "Wicomico": ["A-R", "S-Z"]
                },
                1929: {
                    "Allegany": ["A-K", "L-Z"],
                    "Anne Arundel": ["A-J", "K-Z"],
                    "Baltimore": ["A-G", "H-Q", "R-Z"],
                    "Carroll": ["A-C", "D-Z"],
                    "Dorchester": ["A-G", "H-Z"],
                    "Frederick": ["A-L", "M-Z"],
                    "Harford": ["A-M", "N-Z"],
                    "Kent": ["A-Q", "R-Z"],
                    "Montgomery": ["A-R", "S-Z"],
                    "Prince George's": ["A-Q", "R-Z"],
                    "Saint Mary's": ["A-L", "M-Z"],
                    "Washington": ["A-C", "D-R", "S-Z"],
                    "Wicomico": ["A-O", "P-Z"]
                },
                1930: {
                    "Allegany": ["A-K", "L-Z"],
                    "Anne Arundel": ["A-J", "K-Z"],
                    "Baltimore": ["A-G", "H-P", "Q-Z"],
                    "Carroll": ["A-S", "S-Z"],
                    "Dorchester": ["A-R", "S-Z"],
                    "Frederick": ["A-H", "I-Z"],
                    "Harford": ["A-S", "T-Z"],
                    "Montgomery": ["A-C", "D-Z"],
                    "Washington": ["A-K", "L-Z"],
                    "Wicomico": ["A-S", "T-Z"]
                }
            };

            this.YEAR_EXCEPTION_SPECIAL = {
                "1928-Garrett": [
                    { se43: 9679, label: "" }
                ]
            };
        }


        buildIndex() {

            const index = {};
            let se43 = 1;

            // 1910-05 through 1923-12: monthly files
            let year = 1910;
            let month = 5;

            while (year < 1924) {

                const entries = this.monthEntries(year, month);

                for (const [county, label] of entries) {
                    this.addRecord(index, year, month, county, se43, label, "month");
                    se43++;
                }

                month++;
                if (month === 13) {
                    month = 1;
                    year++;
                }
            }

            // 1924-1930: year files
            for (year = 1924; year <= 1930; year++) {

                for (const county of alphabeticalCountyOrder()) {

                    if (year === 1928 && county === "Garrett") {
                        continue;
                    }

                    const splits = this.YEAR_EXCEPTION_SPLITS[year] &&
                        this.YEAR_EXCEPTION_SPLITS[year][county];

                    if (splits) {
                        for (const label of splits) {
                            this.addYearRecord(index, year, county, se43, label);
                            se43++;
                        }
                    } else {
                        this.addYearRecord(index, year, county, se43, null);
                        se43++;
                    }
                }
            }

            for (const key in this.YEAR_EXCEPTION_SPECIAL) {

                const [specialYear, county] = key.split("-");

                for (const record of this.YEAR_EXCEPTION_SPECIAL[key]) {
                    this.addYearRecord(index, Number(specialYear), county, record.se43, record.label);
                }
            }

            // 1931-1951: monthly files, continuing after the yearly block
            year = 1931;
            month = 1;

            while (se43 <= 9678) {

                const entries = this.monthEntries(year, month);

                for (const [county, label] of entries) {

                    this.addRecord(index, year, month, county, se43, label);
                    se43++;

                    if (se43 > 9678) {
                        break;
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


        addRecord(index, year, month, county, se43, label, periodType) {

            const key = `${year}-${month}-${county}`;

            if (!index[key]) {
                index[key] = [];
            }

            index[key].push({ se43, label, periodType });
        }


        addYearRecord(index, year, county, number, label = null) {
            for (let month = 1; month <= 12; month++) {
                this.addRecord(index, year, month, county, number, label, "year");
            }
        }


        countyOrder(year, month) {

            if (year * 100 + month >= 191601) {
                return alphabeticalCountyOrder();
            }

            return [...BASE_COUNTIES];
        }


        monthEntries(year, month) {

            const counties = this.countyOrder(year, month);
            const output = [];

            if (year === 1918 && month === 10) {

                for (const county of counties) {
                    if (county === "Anne Arundel" || county === "Baltimore") {
                        output.push([county, "A-K"]);
                        output.push([county, "L-Z"]);
                    } else {
                        output.push([county, null]);
                    }
                }

                return output;
            }

            for (const county of counties) {

                if (this.YEAR_EXCEPTION_SPLITS[year] && this.YEAR_EXCEPTION_SPLITS[year][county]) {
                    for (const label of this.YEAR_EXCEPTION_SPLITS[year][county]) {
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
                    month: record.periodType === "year" ? null : month,
                    number: record.se43,
                    label: record.label || "",
                    url: this.archiveUrl(record.se43)
                })
            );
        }

    }

    const instance = new SE43Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.SE43 = instance;

})(typeof window !== "undefined" ? window : globalThis);
