if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("./ce502-data.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const DATA = global.MDRecordSearch.CE502_DATA;

    function formatRecordDateRange(record) {

        const start = `${String(record.startMonth).padStart(2, "0")}/${record.year}`;

        if (record.startMonth === record.endMonth) {
            return start;
        }

        const end = `${String(record.endMonth).padStart(2, "0")}/${record.year}`;

        return `${start}-${end}`;
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


        canHandle(location, month, year) {

            if (location !== "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        /**
         * Every record is Baltimore City, so there's no jurisdiction
         * dimension to filter on - just find every record whose date
         * span covers the requested month/year. A record's label leads
         * with its actual date span (e.g. "03/1952-04/1952"), same as
         * CM1132, since a file often covers more than the single month
         * that was searched for.
         */
        lookupLocationMonthYear(location, month, year) {

            if (location !== "Baltimore City") {
                return [];
            }

            const matches = DATA.DATE_CERT_RECORDS.filter(record =>
                record.year === year &&
                month >= record.startMonth &&
                month <= record.endMonth
            );

            return matches.map(record => {

                const certLabel = record.certLabel || `Nos. ${record.certStart}-${record.certEnd}`;

                return this.createResult({
                    location: "Baltimore City",
                    year,
                    month,
                    number: record.number,
                    label: `${formatRecordDateRange(record)} ${certLabel}`,
                    url: this.archiveUrl(record.number)
                });
            });
        }


        /**
         * Certificate numbers reset every year (format "YYYY-NNNNN",
         * e.g. "1952-3000" - same convention as SE46's 1988-2014 era),
         * not one continuous running sequence like CM1132. Implemented
         * as a filter (every record whose range contains the number),
         * not a find-first - this is what naturally returns BOTH
         * CE502-52 and CE502-53 for "1952-3000" (see ce502-data.js's
         * header comment on the confirmed duplicate 3000) without any
         * special-casing here.
         *
         * Page-jump math matches SE46's pre-2002 (backs-scanned) era:
         * certificates are on every other page, the first certificate
         * in a record's range sits at page 0.
         */
        lookupCertificateNumber(input) {

            const parsed = parseYearCertificate(input);

            if (!parsed) {
                return [];
            }

            const { year, cert } = parsed;

            const matches = DATA.DATE_CERT_RECORDS.filter(record =>
                record.year === year &&
                cert >= record.certStart &&
                cert <= record.certEnd
            );

            return matches.flatMap(record => {

                const url = this.archiveUrl(record.number);

                if (!url) {
                    return [];
                }

                const position = cert - record.certStart;
                const page = position * 2;

                const certLabel = record.certLabel || `Nos. ${record.certStart}-${record.certEnd}`;

                return [
                    this.createResult({
                        location: "Baltimore City",
                        year,
                        month: record.startMonth,
                        number: record.number,
                        label: `${formatRecordDateRange(record)} ${certLabel}`,
                        certificateNumber: `${year}-${cert}`,
                        url,
                        approximatePageUrl: `${url}page/n${page}/mode/1up`
                    })
                ];
            });
        }

    }

    const instance = new CE502Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.CE502 = instance;

})(typeof window !== "undefined" ? window : globalThis);
