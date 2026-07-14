if (typeof require !== "undefined") {
    require("../core/base-series.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;

    // "Unlettered", then A-G - each block is certificates 1-100000, and
    // the running number resets at each letter (e.g. "A1" is the first
    // certificate of the A block). Linearized here as
    // blockIndex*100000 + N (N from 1-100000) so ranges that cross a
    // letter boundary within one record (e.g. "Nos. 98451-A1974") can
    // be compared as plain numbers.
    const CERT_BLOCK_LETTERS = ["", "A", "B", "C", "D", "E", "F", "G"];

    function parseCertificateNumber(input) {

        const raw = String(input || "").trim().toUpperCase();
        const match = raw.match(/^([A-G]?)(\d+)$/);

        if (!match) {
            return null;
        }

        const [, letter, numStr] = match;
        const blockIndex = CERT_BLOCK_LETTERS.indexOf(letter);
        const number = Number(numStr);

        if (blockIndex === -1 || number < 1 || number > 100000) {
            return null;
        }

        return blockIndex * 100000 + number;
    }

    function formatCertificateNumber(linear) {

        const blockIndex = Math.floor((linear - 1) / 100000);
        const number = linear - blockIndex * 100000;

        return `${CERT_BLOCK_LETTERS[blockIndex]}${number}`;
    }


    function formatRecordDateRange(date) {

        const start = `${String(date.startMonth).padStart(2, "0")}/${date.startYear}`;

        if (date.startYear === date.endYear && date.startMonth === date.endMonth) {
            return start;
        }

        const end = `${String(date.endMonth).padStart(2, "0")}/${date.endYear}`;

        return `${start}-${end}`;
    }


    class CM1132Series extends BaseSeries {

        constructor() {

            super("CM1132", "death");

            // Computed from DATE_CERT_RECORDS below (first record's
            // start, last record's end) - the exact bounds, not a
            // rough estimate like the original 1875-1949 guess.
            this.dateRange = { startYear: 1874, startMonth: 12, endYear: 1950, endMonth: 1 };

            this.ARCHIVE_RANGES = [
                { start: 1, end: 30, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00001-30", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 31, end: 31, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-0031", prefix: null, padding: null },
                { start: 32, end: 40, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00032-40", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 41, end: 50, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00041-50", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 51, end: 60, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00051-60", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 61, end: 70, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00061-70", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 71, end: 80, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00071-80", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 81, end: 90, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00081-90", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 91, end: 100, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00091-100", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 101, end: 110, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00101-110", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 111, end: 120, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00111-120", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 121, end: 130, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00121-130", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 131, end: 140, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00131-140", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 141, end: 149, collection: "reclaim-the-records-baltimore-city-death-certificates-1875-1921-msa-cm-1132-00141-149", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_1875-1921_-_msa_cm1132_-_", padding: 5 },
                { start: 150, end: 248, collection: "reclaim-the-records-baltimore-city-death-certificates-msa-cm-1132-000150-248", prefix: "Reclaim_The_Records_-_Baltimore_City_Death_Certificates_-_msa_cm1132_", padding: 6 }
            ];

            // One confirmed unused/skipped record - it consumes a
            // series number but was never a distinct scanned item.
            this.UNUSED_RECORDS = {
                244: "Not used - previously a duplicate entry"
            };

            // Per-record date range and certificate-number range,
            // transcribed from the MSA finding aid. Consecutive records'
            // date ranges deliberately overlap by one month (e.g. record
            // 1 ends 05/1875, record 2 starts 05/1875) - a query for
            // that boundary month genuinely could be in either book, so
            // lookupLocationMonthYear() below returns both rather than
            // guessing. Certificate ranges, by contrast, are NOT always
            // contiguous between records (e.g. record 15 ends at 48500,
            // record 16 starts at 48507) - lookupCertificateNumber()
            // correctly returns nothing for a number that falls in one
            // of these small gaps, rather than attaching it to the
            // nearest neighbor. `cert: null` with a real `date` (record
            // 60) means that unit is a continuation note with no
            // certificate range of its own, not a gap in the data.
            // Annotations about missing/duplicate individual certificate
            // numbers within a record's range are not modeled here -
            // check the MSA guide directly for that level of detail.
            this.DATE_CERT_RECORDS = [
                { number: 1, date: { startYear: 1874, startMonth: 12, endYear: 1875, endMonth: 5 }, cert: { startLinear: 1, endLinear: 2830, label: "Nos. 1-2830" } },
                { number: 2, date: { startYear: 1875, startMonth: 5, endYear: 1875, endMonth: 10 }, cert: { startLinear: 2831, endLinear: 6210, label: "Nos. 2831-6210" } },
                { number: 3, date: { startYear: 1875, startMonth: 10, endYear: 1876, endMonth: 5 }, cert: { startLinear: 6211, endLinear: 9585, label: "Nos. 6211-9585" } },
                { number: 4, date: { startYear: 1876, startMonth: 5, endYear: 1876, endMonth: 9 }, cert: { startLinear: 9586, endLinear: 12810, label: "Nos. 9586-12810" } },
                { number: 5, date: { startYear: 1876, startMonth: 9, endYear: 1877, endMonth: 3 }, cert: { startLinear: 12811, endLinear: 16160, label: "Nos. 12811-16160" } },
                { number: 6, date: { startYear: 1877, startMonth: 3, endYear: 1877, endMonth: 7 }, cert: { startLinear: 16161, endLinear: 19090, label: "Nos. 16161-19090" } },
                { number: 7, date: { startYear: 1877, startMonth: 7, endYear: 1877, endMonth: 10 }, cert: { startLinear: 19091, endLinear: 21500, label: "Nos. 19091-21500" } },
                { number: 8, date: { startYear: 1877, startMonth: 10, endYear: 1878, endMonth: 5 }, cert: { startLinear: 21501, endLinear: 25000, label: "Nos. 21501-25000" } },
                { number: 9, date: { startYear: 1878, startMonth: 5, endYear: 1878, endMonth: 10 }, cert: { startLinear: 25001, endLinear: 28300, label: "Nos. 25001-28300" } },
                { number: 10, date: { startYear: 1878, startMonth: 10, endYear: 1879, endMonth: 4 }, cert: { startLinear: 28301, endLinear: 31500, label: "Nos. 28301-31500" } },
                { number: 11, date: { startYear: 1879, startMonth: 4, endYear: 1879, endMonth: 9 }, cert: { startLinear: 31501, endLinear: 35000, label: "Nos. 31501-35000" } },
                { number: 12, date: { startYear: 1879, startMonth: 9, endYear: 1880, endMonth: 3 }, cert: { startLinear: 35001, endLinear: 38400, label: "Nos. 35001-38400" } },
                { number: 13, date: { startYear: 1880, startMonth: 3, endYear: 1880, endMonth: 7 }, cert: { startLinear: 38401, endLinear: 41800, label: "Nos. 38401-41800" } },
                { number: 14, date: { startYear: 1880, startMonth: 7, endYear: 1881, endMonth: 1 }, cert: { startLinear: 41801, endLinear: 45224, label: "Nos. 41801-45224" } },
                { number: 15, date: { startYear: 1881, startMonth: 1, endYear: 1881, endMonth: 6 }, cert: { startLinear: 45225, endLinear: 48500, label: "Nos. 45225-48500" } },
                { number: 16, date: { startYear: 1881, startMonth: 6, endYear: 1881, endMonth: 10 }, cert: { startLinear: 48507, endLinear: 51800, label: "Nos. 48507-51800" } },
                { number: 17, date: { startYear: 1881, startMonth: 10, endYear: 1882, endMonth: 1 }, cert: { startLinear: 51801, endLinear: 54400, label: "Nos. 51801-54400" } },
                { number: 18, date: { startYear: 1882, startMonth: 1, endYear: 1882, endMonth: 6 }, cert: { startLinear: 54401, endLinear: 57300, label: "Nos. 54401-57300" } },
                { number: 19, date: { startYear: 1882, startMonth: 6, endYear: 1882, endMonth: 10 }, cert: { startLinear: 57301, endLinear: 60434, label: "Nos. 57301-60434" } },
                { number: 20, date: { startYear: 1882, startMonth: 10, endYear: 1883, endMonth: 1 }, cert: { startLinear: 60435, endLinear: 63700, label: "Nos. 60435-63700" } },
                { number: 21, date: { startYear: 1883, startMonth: 1, endYear: 1883, endMonth: 6 }, cert: { startLinear: 63701, endLinear: 67200, label: "Nos. 63701-67200" } },
                { number: 22, date: { startYear: 1883, startMonth: 6, endYear: 1883, endMonth: 10 }, cert: { startLinear: 67201, endLinear: 70700, label: "Nos. 67201-70700" } },
                { number: 23, date: { startYear: 1883, startMonth: 10, endYear: 1884, endMonth: 3 }, cert: { startLinear: 70701, endLinear: 74100, label: "Nos. 70701-74100" } },
                { number: 24, date: { startYear: 1884, startMonth: 3, endYear: 1884, endMonth: 8 }, cert: { startLinear: 74101, endLinear: 77500, label: "Nos. 74101-77500" } },
                { number: 25, date: { startYear: 1884, startMonth: 7, endYear: 1885, endMonth: 1 }, cert: { startLinear: 77501, endLinear: 80836, label: "Nos. 77501-80836" } },
                { number: 26, date: { startYear: 1885, startMonth: 1, endYear: 1885, endMonth: 6 }, cert: { startLinear: 80837, endLinear: 84300, label: "Nos. 80837-84300" } },
                { number: 27, date: { startYear: 1885, startMonth: 6, endYear: 1885, endMonth: 11 }, cert: { startLinear: 84301, endLinear: 87700, label: "Nos. 84301-87700" } },
                { number: 28, date: { startYear: 1885, startMonth: 11, endYear: 1886, endMonth: 5 }, cert: { startLinear: 87701, endLinear: 91675, label: "Nos. 87701-91675" } },
                { number: 29, date: { startYear: 1886, startMonth: 5, endYear: 1886, endMonth: 9 }, cert: { startLinear: 91676, endLinear: 95000, label: "Nos. 91676-95000" } },
                { number: 30, date: { startYear: 1886, startMonth: 9, endYear: 1887, endMonth: 3 }, cert: { startLinear: 95001, endLinear: 98450, label: "Nos. 95001-98450" } },
                { number: 31, date: { startYear: 1887, startMonth: 3, endYear: 1887, endMonth: 8 }, cert: { startLinear: 98451, endLinear: 101974, label: "Nos. 98451-A1974" } },
                { number: 32, date: { startYear: 1887, startMonth: 8, endYear: 1888, endMonth: 1 }, cert: { startLinear: 101975, endLinear: 105600, label: "Nos. A1975-A5600" } },
                { number: 33, date: { startYear: 1888, startMonth: 1, endYear: 1888, endMonth: 6 }, cert: { startLinear: 105601, endLinear: 109050, label: "Nos. A5601-A9050" } },
                { number: 34, date: { startYear: 1888, startMonth: 6, endYear: 1888, endMonth: 10 }, cert: { startLinear: 109051, endLinear: 112574, label: "Nos. A9051-A12574" } },
                { number: 35, date: { startYear: 1888, startMonth: 10, endYear: 1889, endMonth: 3 }, cert: { startLinear: 112575, endLinear: 115800, label: "Nos. A12575-A15800" } },
                { number: 36, date: { startYear: 1889, startMonth: 3, endYear: 1889, endMonth: 7 }, cert: { startLinear: 115801, endLinear: 119200, label: "Nos. A15801-A19200" } },
                { number: 37, date: { startYear: 1889, startMonth: 7, endYear: 1889, endMonth: 12 }, cert: { startLinear: 119201, endLinear: 122650, label: "Nos. A19201-A22650" } },
                { number: 38, date: { startYear: 1889, startMonth: 12, endYear: 1890, endMonth: 4 }, cert: { startLinear: 122651, endLinear: 126100, label: "Nos. A22651-A26100" } },
                { number: 39, date: { startYear: 1890, startMonth: 4, endYear: 1890, endMonth: 7 }, cert: { startLinear: 126101, endLinear: 129310, label: "Nos. A26101-A29310" } },
                { number: 40, date: { startYear: 1890, startMonth: 7, endYear: 1890, endMonth: 12 }, cert: { startLinear: 129311, endLinear: 132800, label: "Nos. A29311-A32800" } },
                { number: 41, date: { startYear: 1890, startMonth: 12, endYear: 1891, endMonth: 5 }, cert: { startLinear: 132801, endLinear: 136250, label: "Nos. A32801-A36250" } },
                { number: 42, date: { startYear: 1891, startMonth: 5, endYear: 1891, endMonth: 9 }, cert: { startLinear: 136251, endLinear: 140050, label: "Nos. A36251-A40050" } },
                { number: 43, date: { startYear: 1891, startMonth: 9, endYear: 1891, endMonth: 12 }, cert: { startLinear: 140051, endLinear: 142900, label: "Nos. A40051-A42900" } },
                { number: 44, date: { startYear: 1891, startMonth: 12, endYear: 1892, endMonth: 3 }, cert: { startLinear: 142901, endLinear: 145800, label: "Nos. A42901-A45800" } },
                { number: 45, date: { startYear: 1892, startMonth: 3, endYear: 1892, endMonth: 7 }, cert: { startLinear: 145801, endLinear: 149000, label: "Nos. A45801-A49000" } },
                { number: 46, date: { startYear: 1892, startMonth: 7, endYear: 1892, endMonth: 10 }, cert: { startLinear: 149001, endLinear: 152124, label: "Nos. A49001-A52124" } },
                { number: 47, date: { startYear: 1892, startMonth: 10, endYear: 1893, endMonth: 2 }, cert: { startLinear: 152125, endLinear: 155150, label: "Nos. A52125-A55150" } },
                { number: 48, date: { startYear: 1893, startMonth: 2, endYear: 1893, endMonth: 6 }, cert: { startLinear: 155151, endLinear: 158000, label: "Nos. A55151-A58000" } },
                { number: 49, date: { startYear: 1893, startMonth: 6, endYear: 1893, endMonth: 10 }, cert: { startLinear: 158001, endLinear: 161200, label: "Nos. A58001-A61200" } },
                { number: 50, date: { startYear: 1893, startMonth: 10, endYear: 1894, endMonth: 2 }, cert: { startLinear: 161201, endLinear: 164500, label: "Nos. A61201-A64500" } },
                { number: 51, date: { startYear: 1894, startMonth: 2, endYear: 1894, endMonth: 6 }, cert: { startLinear: 164501, endLinear: 167920, label: "Nos. A64501-A67920" } },
                { number: 52, date: { startYear: 1894, startMonth: 6, endYear: 1894, endMonth: 9 }, cert: { startLinear: 167921, endLinear: 171370, label: "Nos. A67921-A71370" } },
                { number: 53, date: { startYear: 1894, startMonth: 11, endYear: 1895, endMonth: 3 }, cert: { startLinear: 171371, endLinear: 174850, label: "Nos. A71371-A74850" } },
                { number: 54, date: { startYear: 1895, startMonth: 3, endYear: 1895, endMonth: 7 }, cert: { startLinear: 174851, endLinear: 178413, label: "Nos. A74851-A78413" } },
                { number: 55, date: { startYear: 1895, startMonth: 7, endYear: 1895, endMonth: 11 }, cert: { startLinear: 178414, endLinear: 182000, label: "Nos. A78414-A82000" } },
                { number: 56, date: { startYear: 1895, startMonth: 11, endYear: 1896, endMonth: 3 }, cert: { startLinear: 182001, endLinear: 185325, label: "Nos. A82001-A85325" } },
                { number: 57, date: { startYear: 1896, startMonth: 3, endYear: 1896, endMonth: 7 }, cert: { startLinear: 185326, endLinear: 188700, label: "Nos. A85326-A88700" } },
                { number: 58, date: { startYear: 1896, startMonth: 7, endYear: 1896, endMonth: 12 }, cert: { startLinear: 188701, endLinear: 192250, label: "Nos. A88701-A92250" } },
                { number: 59, date: { startYear: 1896, startMonth: 11, endYear: 1897, endMonth: 4 }, cert: { startLinear: 192251, endLinear: 195675, label: "Nos. A92251-A95675" } },
                { number: 60, date: { startYear: 1896, startMonth: 11, endYear: 1897, endMonth: 4 }, cert: null },
                { number: 61, date: { startYear: 1897, startMonth: 4, endYear: 1897, endMonth: 8 }, cert: { startLinear: 195676, endLinear: 199250, label: "Nos. A95676-A99250" } },
                { number: 62, date: { startYear: 1897, startMonth: 8, endYear: 1898, endMonth: 1 }, cert: { startLinear: 199251, endLinear: 202675, label: "Nos. A99251-B2675" } },
                { number: 63, date: { startYear: 1898, startMonth: 1, endYear: 1898, endMonth: 5 }, cert: { startLinear: 202676, endLinear: 206000, label: "Nos. B2676-B6000" } },
                { number: 64, date: { startYear: 1898, startMonth: 5, endYear: 1898, endMonth: 8 }, cert: { startLinear: 206001, endLinear: 209030, label: "Nos. B6001-B9030" } },
                { number: 65, date: { startYear: 1898, startMonth: 8, endYear: 1898, endMonth: 12 }, cert: { startLinear: 209031, endLinear: 212400, label: "Nos. B9031-B12400" } },
                { number: 66, date: { startYear: 1898, startMonth: 12, endYear: 1899, endMonth: 4 }, cert: { startLinear: 212401, endLinear: 216100, label: "Nos. B12401-B16100" } },
                { number: 67, date: { startYear: 1899, startMonth: 4, endYear: 1899, endMonth: 8 }, cert: { startLinear: 216101, endLinear: 219925, label: "Nos. B16101-B19925" } },
                { number: 68, date: { startYear: 1899, startMonth: 8, endYear: 1899, endMonth: 12 }, cert: { startLinear: 219926, endLinear: 222809, label: "Nos. B19926-B22809" } },
                { number: 69, date: { startYear: 1899, startMonth: 12, endYear: 1900, endMonth: 4 }, cert: { startLinear: 222810, endLinear: 225999, label: "Nos. B22810-B25999" } },
                { number: 70, date: { startYear: 1900, startMonth: 4, endYear: 1900, endMonth: 7 }, cert: { startLinear: 226000, endLinear: 229449, label: "Nos. B26000-B29449" } },
                { number: 71, date: { startYear: 1900, startMonth: 7, endYear: 1900, endMonth: 11 }, cert: { startLinear: 229450, endLinear: 232599, label: "Nos. B29450-B32599" } },
                { number: 72, date: { startYear: 1900, startMonth: 11, endYear: 1901, endMonth: 3 }, cert: { startLinear: 232600, endLinear: 235999, label: "Nos. B32600-B35999" } },
                { number: 73, date: { startYear: 1901, startMonth: 3, endYear: 1901, endMonth: 7 }, cert: { startLinear: 236000, endLinear: 239674, label: "Nos. B36000-B39674" } },
                { number: 74, date: { startYear: 1901, startMonth: 7, endYear: 1901, endMonth: 11 }, cert: { startLinear: 239675, endLinear: 242999, label: "Nos. B39675-B42999" } },
                { number: 75, date: { startYear: 1901, startMonth: 11, endYear: 1902, endMonth: 3 }, cert: { startLinear: 243000, endLinear: 246426, label: "Nos. B43000-B46426" } },
                { number: 76, date: { startYear: 1902, startMonth: 3, endYear: 1902, endMonth: 7 }, cert: { startLinear: 246428, endLinear: 249399, label: "Nos. B46428-B49399" } },
                { number: 77, date: { startYear: 1902, startMonth: 7, endYear: 1902, endMonth: 11 }, cert: { startLinear: 249400, endLinear: 252799, label: "Nos. B49400-B52799" } },
                { number: 78, date: { startYear: 1902, startMonth: 11, endYear: 1903, endMonth: 2 }, cert: { startLinear: 252800, endLinear: 255899, label: "Nos. B52800-B55899" } },
                { number: 79, date: { startYear: 1903, startMonth: 2, endYear: 1903, endMonth: 6 }, cert: { startLinear: 255900, endLinear: 259368, label: "Nos. B55900-B59368" } },
                { number: 80, date: { startYear: 1903, startMonth: 6, endYear: 1903, endMonth: 9 }, cert: { startLinear: 259372, endLinear: 261850, label: "Nos. B59372-B61850" } },
                { number: 81, date: { startYear: 1903, startMonth: 9, endYear: 1904, endMonth: 1 }, cert: { startLinear: 261851, endLinear: 265199, label: "Nos. B61851-B65199" } },
                { number: 82, date: { startYear: 1904, startMonth: 1, endYear: 1904, endMonth: 4 }, cert: { startLinear: 265200, endLinear: 268055, label: "Nos. B65200-B68055" } },
                { number: 83, date: { startYear: 1904, startMonth: 4, endYear: 1904, endMonth: 8 }, cert: { startLinear: 268057, endLinear: 271366, label: "Nos. B68057-B71366" } },
                { number: 84, date: { startYear: 1904, startMonth: 8, endYear: 1904, endMonth: 11 }, cert: { startLinear: 271367, endLinear: 274125, label: "Nos. B71367-B74125" } },
                { number: 85, date: { startYear: 1904, startMonth: 11, endYear: 1905, endMonth: 3 }, cert: { startLinear: 274126, endLinear: 277340, label: "Nos. B74126-B77340" } },
                { number: 86, date: { startYear: 1905, startMonth: 3, endYear: 1905, endMonth: 6 }, cert: { startLinear: 277341, endLinear: 280250, label: "Nos. B77341-B80250" } },
                { number: 87, date: { startYear: 1905, startMonth: 6, endYear: 1905, endMonth: 10 }, cert: { startLinear: 280251, endLinear: 283400, label: "Nos. B80251-B83400" } },
                { number: 88, date: { startYear: 1905, startMonth: 9, endYear: 1906, endMonth: 1 }, cert: { startLinear: 283401, endLinear: 285999, label: "Nos. B83401-B85999" } },
                { number: 89, date: { startYear: 1905, startMonth: 12, endYear: 1906, endMonth: 3 }, cert: { startLinear: 286000, endLinear: 288665, label: "Nos. B86000-B88665" } },
                { number: 90, date: { startYear: 1906, startMonth: 3, endYear: 1906, endMonth: 6 }, cert: { startLinear: 288666, endLinear: 291164, label: "Nos. B88666-B91164" } },
                { number: 91, date: { startYear: 1906, startMonth: 6, endYear: 1906, endMonth: 9 }, cert: { startLinear: 291165, endLinear: 293999, label: "Nos. B91165-B93999" } },
                { number: 92, date: { startYear: 1906, startMonth: 9, endYear: 1907, endMonth: 1 }, cert: { startLinear: 294000, endLinear: 296799, label: "Nos. B94000-B96799" } },
                { number: 93, date: { startYear: 1906, startMonth: 12, endYear: 1907, endMonth: 3 }, cert: { startLinear: 296800, endLinear: 299663, label: "Nos. B96800-B99663" } },
                { number: 94, date: { startYear: 1907, startMonth: 3, endYear: 1907, endMonth: 7 }, cert: { startLinear: 299667, endLinear: 302499, label: "Nos. B99667-C2499" } },
                { number: 95, date: { startYear: 1907, startMonth: 7, endYear: 1907, endMonth: 10 }, cert: { startLinear: 302500, endLinear: 305299, label: "Nos. C2500-C5299" } },
                { number: 96, date: { startYear: 1907, startMonth: 10, endYear: 1908, endMonth: 1 }, cert: { startLinear: 305300, endLinear: 308399, label: "Nos. C5300-C8399" } },
                { number: 97, date: { startYear: 1908, startMonth: 1, endYear: 1908, endMonth: 4 }, cert: { startLinear: 308400, endLinear: 311174, label: "Nos. C8400-C11174" } },
                { number: 98, date: { startYear: 1908, startMonth: 4, endYear: 1908, endMonth: 7 }, cert: { startLinear: 311175, endLinear: 313924, label: "Nos. C11175-C13924" } },
                { number: 99, date: { startYear: 1908, startMonth: 7, endYear: 1908, endMonth: 10 }, cert: { startLinear: 313925, endLinear: 316299, label: "Nos. C13925-C16299" } },
                { number: 100, date: { startYear: 1908, startMonth: 10, endYear: 1909, endMonth: 2 }, cert: { startLinear: 316300, endLinear: 319274, label: "Nos. C16300-C19274" } },
                { number: 101, date: { startYear: 1909, startMonth: 1, endYear: 1909, endMonth: 5 }, cert: { startLinear: 319275, endLinear: 322274, label: "Nos. C19275-C22274" } },
                { number: 102, date: { startYear: 1909, startMonth: 5, endYear: 1909, endMonth: 8 }, cert: { startLinear: 322275, endLinear: 325199, label: "Nos. C22275-C25199" } },
                { number: 103, date: { startYear: 1909, startMonth: 8, endYear: 1909, endMonth: 11 }, cert: { startLinear: 325200, endLinear: 327699, label: "Nos. C25200-C27699" } },
                { number: 104, date: { startYear: 1909, startMonth: 11, endYear: 1909, endMonth: 12 }, cert: { startLinear: 327700, endLinear: 328656, label: "Nos. C27700-C28656" } },
                { number: 105, date: { startYear: 1909, startMonth: 12, endYear: 1910, endMonth: 4 }, cert: { startLinear: 328657, endLinear: 331890, label: "Nos. C28657-C31890" } },
                { number: 106, date: { startYear: 1910, startMonth: 4, endYear: 1910, endMonth: 7 }, cert: { startLinear: 331891, endLinear: 335120, label: "Nos. C31891-C35120" } },
                { number: 107, date: { startYear: 1910, startMonth: 7, endYear: 1910, endMonth: 12 }, cert: { startLinear: 335121, endLinear: 338660, label: "Nos. C35121-C38660" } },
                { number: 108, date: { startYear: 1910, startMonth: 12, endYear: 1911, endMonth: 3 }, cert: { startLinear: 338661, endLinear: 341800, label: "Nos. C38661-C41800" } },
                { number: 109, date: { startYear: 1911, startMonth: 3, endYear: 1911, endMonth: 7 }, cert: { startLinear: 341801, endLinear: 345290, label: "Nos. C41801-C45290" } },
                { number: 110, date: { startYear: 1911, startMonth: 7, endYear: 1911, endMonth: 11 }, cert: { startLinear: 345291, endLinear: 348430, label: "Nos. C45291-C48430" } },
                { number: 111, date: { startYear: 1911, startMonth: 11, endYear: 1912, endMonth: 3 }, cert: { startLinear: 348431, endLinear: 351917, label: "Nos. C48431-C51917" } },
                { number: 112, date: { startYear: 1912, startMonth: 3, endYear: 1912, endMonth: 6 }, cert: { startLinear: 351918, endLinear: 354949, label: "Nos. C51918-C54949" } },
                { number: 113, date: { startYear: 1912, startMonth: 6, endYear: 1912, endMonth: 10 }, cert: { startLinear: 354950, endLinear: 358196, label: "Nos. C54950-C58196" } },
                { number: 114, date: { startYear: 1912, startMonth: 10, endYear: 1913, endMonth: 2 }, cert: { startLinear: 358197, endLinear: 361364, label: "Nos. C58197-C61364" } },
                { number: 115, date: { startYear: 1913, startMonth: 2, endYear: 1913, endMonth: 5 }, cert: { startLinear: 361365, endLinear: 364894, label: "Nos. C61365-C64894" } },
                { number: 116, date: { startYear: 1913, startMonth: 5, endYear: 1913, endMonth: 9 }, cert: { startLinear: 364895, endLinear: 368025, label: "Nos. C64895-C68025" } },
                { number: 117, date: { startYear: 1913, startMonth: 9, endYear: 1914, endMonth: 1 }, cert: { startLinear: 368026, endLinear: 371525, label: "Nos. C68026-C71525" } },
                { number: 118, date: { startYear: 1914, startMonth: 1, endYear: 1914, endMonth: 4 }, cert: { startLinear: 371526, endLinear: 374735, label: "Nos. C71526-C74735" } },
                { number: 119, date: { startYear: 1914, startMonth: 4, endYear: 1914, endMonth: 8 }, cert: { startLinear: 374736, endLinear: 378220, label: "Nos. C74736-C78220" } },
                { number: 120, date: { startYear: 1914, startMonth: 8, endYear: 1914, endMonth: 12 }, cert: { startLinear: 378221, endLinear: 381430, label: "Nos. C78221-C81430" } },
                { number: 121, date: { startYear: 1914, startMonth: 12, endYear: 1915, endMonth: 1 }, cert: { startLinear: 381431, endLinear: 382018, label: "Nos. C81431-C82018" } },
                { number: 122, date: { startYear: 1915, startMonth: 1, endYear: 1915, endMonth: 5 }, cert: { startLinear: 382019, endLinear: 385350, label: "Nos. C82019-C85350" } },
                { number: 123, date: { startYear: 1915, startMonth: 5, endYear: 1915, endMonth: 10 }, cert: { startLinear: 385351, endLinear: 388599, label: "Nos. C85351-C88599" } },
                { number: 124, date: { startYear: 1915, startMonth: 10, endYear: 1916, endMonth: 1 }, cert: { startLinear: 388600, endLinear: 391699, label: "Nos. C88600-C91699" } },
                { number: 125, date: { startYear: 1916, startMonth: 1, endYear: 1916, endMonth: 5 }, cert: { startLinear: 391700, endLinear: 395050, label: "Nos. C91700-C95050" } },
                { number: 126, date: { startYear: 1916, startMonth: 5, endYear: 1916, endMonth: 9 }, cert: { startLinear: 395051, endLinear: 398200, label: "Nos. C95051-C98200" } },
                { number: 127, date: { startYear: 1916, startMonth: 9, endYear: 1917, endMonth: 1 }, cert: { startLinear: 398201, endLinear: 401560, label: "Nos. C98201-D1560" } },
                { number: 128, date: { startYear: 1917, startMonth: 1, endYear: 1917, endMonth: 5 }, cert: { startLinear: 401561, endLinear: 405030, label: "Nos. D1561-D5030" } },
                { number: 129, date: { startYear: 1917, startMonth: 5, endYear: 1917, endMonth: 9 }, cert: { startLinear: 405031, endLinear: 408200, label: "Nos. D5031-D8200" } },
                { number: 130, date: { startYear: 1917, startMonth: 9, endYear: 1917, endMonth: 12 }, cert: { startLinear: 408201, endLinear: 411418, label: "Nos. D8201-D11418" } },
                { number: 131, date: { startYear: 1917, startMonth: 12, endYear: 1918, endMonth: 3 }, cert: { startLinear: 411419, endLinear: 414350, label: "Nos. D11419-D14350" } },
                { number: 132, date: { startYear: 1918, startMonth: 3, endYear: 1918, endMonth: 7 }, cert: { startLinear: 414351, endLinear: 417775, label: "Nos. D14351-D17775" } },
                { number: 133, date: { startYear: 1918, startMonth: 7, endYear: 1918, endMonth: 10 }, cert: { startLinear: 417776, endLinear: 420918, label: "Nos. D17776-D20918" } },
                { number: 134, date: { startYear: 1918, startMonth: 10, endYear: 1918, endMonth: 10 }, cert: { startLinear: 420919, endLinear: 424300, label: "Nos. D20919-D24300" } },
                { number: 135, date: { startYear: 1918, startMonth: 10, endYear: 1919, endMonth: 1 }, cert: { startLinear: 424301, endLinear: 427375, label: "Nos. D24301-D27375" } },
                { number: 136, date: { startYear: 1919, startMonth: 1, endYear: 1919, endMonth: 4 }, cert: { startLinear: 427376, endLinear: 430741, label: "Nos. D27376-D30741" } },
                { number: 137, date: { startYear: 1919, startMonth: 4, endYear: 1919, endMonth: 7 }, cert: { startLinear: 430742, endLinear: 433875, label: "Nos. D30742-D33875" } },
                { number: 138, date: { startYear: 1919, startMonth: 7, endYear: 1919, endMonth: 11 }, cert: { startLinear: 433876, endLinear: 436806, label: "Nos. D33876-D36806" } },
                { number: 139, date: { startYear: 1919, startMonth: 11, endYear: 1920, endMonth: 1 }, cert: { startLinear: 436807, endLinear: 438418, label: "Nos. D36807-D38418" } },
                { number: 140, date: { startYear: 1920, startMonth: 1, endYear: 1920, endMonth: 3 }, cert: { startLinear: 438419, endLinear: 441797, label: "Nos. D38419-D41797" } },
                { number: 141, date: { startYear: 1920, startMonth: 3, endYear: 1920, endMonth: 7 }, cert: { startLinear: 441798, endLinear: 444903, label: "Nos. D41798-D44903" } },
                { number: 142, date: { startYear: 1920, startMonth: 7, endYear: 1920, endMonth: 11 }, cert: { startLinear: 444904, endLinear: 448215, label: "Nos. D44904-D48215" } },
                { number: 143, date: { startYear: 1920, startMonth: 11, endYear: 1921, endMonth: 2 }, cert: { startLinear: 448216, endLinear: 451018, label: "Nos. D48216-D51018" } },
                { number: 144, date: { startYear: 1921, startMonth: 2, endYear: 1921, endMonth: 6 }, cert: { startLinear: 451019, endLinear: 454301, label: "Nos. D51019-D54301" } },
                { number: 145, date: { startYear: 1921, startMonth: 6, endYear: 1921, endMonth: 9 }, cert: { startLinear: 454302, endLinear: 457255, label: "Nos. D54302-D57255" } },
                { number: 146, date: { startYear: 1921, startMonth: 9, endYear: 1922, endMonth: 1 }, cert: { startLinear: 457256, endLinear: 460445, label: "Nos. D57256-D60445" } },
                { number: 147, date: { startYear: 1922, startMonth: 1, endYear: 1922, endMonth: 4 }, cert: { startLinear: 460446, endLinear: 463257, label: "Nos. D60446-D63257" } },
                { number: 148, date: { startYear: 1922, startMonth: 4, endYear: 1922, endMonth: 8 }, cert: { startLinear: 463258, endLinear: 466480, label: "Nos. D63258-D66480" } },
                { number: 149, date: { startYear: 1922, startMonth: 8, endYear: 1922, endMonth: 11 }, cert: { startLinear: 466481, endLinear: 469330, label: "Nos. D66481-D69330" } },
                { number: 150, date: { startYear: 1922, startMonth: 11, endYear: 1923, endMonth: 2 }, cert: { startLinear: 469331, endLinear: 473019, label: "Nos. D69331-D73019" } },
                { number: 151, date: { startYear: 1923, startMonth: 2, endYear: 1923, endMonth: 5 }, cert: { startLinear: 473020, endLinear: 476110, label: "Nos. D73020-D76110" } },
                { number: 152, date: { startYear: 1923, startMonth: 5, endYear: 1923, endMonth: 9 }, cert: { startLinear: 476111, endLinear: 479030, label: "Nos. D76111-D79030" } },
                { number: 153, date: { startYear: 1923, startMonth: 9, endYear: 1923, endMonth: 12 }, cert: { startLinear: 479031, endLinear: 481674, label: "Nos. D79031-D81674" } },
                { number: 154, date: { startYear: 1923, startMonth: 12, endYear: 1924, endMonth: 3 }, cert: { startLinear: 481675, endLinear: 485005, label: "Nos. D81675-D85005" } },
                { number: 155, date: { startYear: 1924, startMonth: 3, endYear: 1924, endMonth: 7 }, cert: { startLinear: 485006, endLinear: 488270, label: "Nos. D85006-D88270" } },
                { number: 156, date: { startYear: 1924, startMonth: 7, endYear: 1924, endMonth: 11 }, cert: { startLinear: 488271, endLinear: 491805, label: "Nos. D88271-D91805" } },
                { number: 157, date: { startYear: 1924, startMonth: 11, endYear: 1925, endMonth: 1 }, cert: { startLinear: 491806, endLinear: 494018, label: "Nos. D91806-D94018" } },
                { number: 158, date: { startYear: 1925, startMonth: 1, endYear: 1925, endMonth: 4 }, cert: { startLinear: 494019, endLinear: 497555, label: "Nos. D94019-D97555" } },
                { number: 159, date: { startYear: 1925, startMonth: 4, endYear: 1925, endMonth: 7 }, cert: { startLinear: 497556, endLinear: 500775, label: "Nos. D97556-E775" } },
                { number: 160, date: { startYear: 1925, startMonth: 7, endYear: 1925, endMonth: 12 }, cert: { startLinear: 500776, endLinear: 504270, label: "Nos. E776-E4270" } },
                { number: 161, date: { startYear: 1925, startMonth: 11, endYear: 1926, endMonth: 2 }, cert: { startLinear: 504271, endLinear: 507506, label: "Nos. E4271-E7506" } },
                { number: 162, date: { startYear: 1926, startMonth: 2, endYear: 1926, endMonth: 5 }, cert: { startLinear: 507507, endLinear: 510760, label: "Nos. E7507-E10760" } },
                { number: 163, date: { startYear: 1926, startMonth: 5, endYear: 1926, endMonth: 9 }, cert: { startLinear: 510761, endLinear: 514455, label: "Nos. E10761-E14455" } },
                { number: 164, date: { startYear: 1926, startMonth: 9, endYear: 1927, endMonth: 1 }, cert: { startLinear: 514456, endLinear: 517560, label: "Nos. E14456-E17560" } },
                { number: 165, date: { startYear: 1927, startMonth: 1, endYear: 1927, endMonth: 4 }, cert: { startLinear: 517561, endLinear: 521050, label: "Nos. E17561-E21050" } },
                { number: 166, date: { startYear: 1927, startMonth: 4, endYear: 1927, endMonth: 7 }, cert: { startLinear: 521051, endLinear: 524075, label: "Nos. E21051-E24075" } },
                { number: 167, date: { startYear: 1927, startMonth: 7, endYear: 1927, endMonth: 11 }, cert: { startLinear: 524076, endLinear: 527570, label: "Nos. E24076-E27570" } },
                { number: 168, date: { startYear: 1927, startMonth: 11, endYear: 1928, endMonth: 2 }, cert: { startLinear: 527571, endLinear: 530845, label: "Nos. E27571-E30845" } },
                { number: 169, date: { startYear: 1928, startMonth: 2, endYear: 1928, endMonth: 5 }, cert: { startLinear: 530846, endLinear: 534000, label: "Nos. E30846-E34000" } },
                { number: 170, date: { startYear: 1928, startMonth: 5, endYear: 1928, endMonth: 9 }, cert: { startLinear: 534001, endLinear: 537500, label: "Nos. E34001-E37500" } },
                { number: 171, date: { startYear: 1928, startMonth: 9, endYear: 1929, endMonth: 1 }, cert: { startLinear: 537501, endLinear: 541040, label: "Nos. E37501-E41040" } },
                { number: 172, date: { startYear: 1929, startMonth: 1, endYear: 1929, endMonth: 3 }, cert: { startLinear: 541041, endLinear: 544315, label: "Nos. E41041-E44315" } },
                { number: 173, date: { startYear: 1929, startMonth: 3, endYear: 1929, endMonth: 7 }, cert: { startLinear: 544316, endLinear: 547850, label: "Nos. E44316-E47850" } },
                { number: 174, date: { startYear: 1929, startMonth: 7, endYear: 1929, endMonth: 11 }, cert: { startLinear: 547851, endLinear: 551027, label: "Nos. E47851-E51027" } },
                { number: 175, date: { startYear: 1929, startMonth: 11, endYear: 1930, endMonth: 1 }, cert: { startLinear: 551028, endLinear: 553000, label: "Nos. E51028-E53000" } },
                { number: 176, date: { startYear: 1930, startMonth: 1, endYear: 1930, endMonth: 4 }, cert: { startLinear: 553001, endLinear: 556475, label: "Nos. E53001-E56475" } },
                { number: 177, date: { startYear: 1930, startMonth: 4, endYear: 1930, endMonth: 8 }, cert: { startLinear: 556476, endLinear: 559672, label: "Nos. E56476-E59672" } },
                { number: 178, date: { startYear: 1930, startMonth: 8, endYear: 1930, endMonth: 12 }, cert: { startLinear: 559673, endLinear: 563110, label: "Nos. E59673-E63110" } },
                { number: 179, date: { startYear: 1930, startMonth: 12, endYear: 1931, endMonth: 3 }, cert: { startLinear: 563111, endLinear: 566280, label: "Nos. E63111-E66280" } },
                { number: 180, date: { startYear: 1931, startMonth: 3, endYear: 1931, endMonth: 6 }, cert: { startLinear: 566281, endLinear: 569730, label: "Nos. E66281-E69730" } },
                { number: 181, date: { startYear: 1931, startMonth: 6, endYear: 1931, endMonth: 10 }, cert: { startLinear: 569731, endLinear: 573170, label: "Nos. E69731-E73170" } },
                { number: 182, date: { startYear: 1931, startMonth: 10, endYear: 1932, endMonth: 2 }, cert: { startLinear: 573171, endLinear: 576360, label: "Nos. E73171-E76360" } },
                { number: 183, date: { startYear: 1932, startMonth: 2, endYear: 1932, endMonth: 5 }, cert: { startLinear: 576361, endLinear: 579550, label: "Nos. E76361-E79550" } },
                { number: 184, date: { startYear: 1932, startMonth: 5, endYear: 1932, endMonth: 9 }, cert: { startLinear: 579551, endLinear: 583075, label: "Nos. E79551-E83075" } },
                { number: 185, date: { startYear: 1932, startMonth: 9, endYear: 1933, endMonth: 1 }, cert: { startLinear: 583076, endLinear: 586290, label: "Nos. E83076-E86290" } },
                { number: 186, date: { startYear: 1933, startMonth: 1, endYear: 1933, endMonth: 4 }, cert: { startLinear: 586291, endLinear: 589790, label: "Nos. E86291-E89790" } },
                { number: 187, date: { startYear: 1933, startMonth: 4, endYear: 1933, endMonth: 8 }, cert: { startLinear: 589791, endLinear: 592965, label: "Nos. E89791-E92965" } },
                { number: 188, date: { startYear: 1933, startMonth: 8, endYear: 1933, endMonth: 12 }, cert: { startLinear: 592966, endLinear: 596000, label: "Nos. E92966-E96000" } },
                { number: 189, date: { startYear: 1933, startMonth: 12, endYear: 1934, endMonth: 3 }, cert: { startLinear: 596001, endLinear: 599060, label: "Nos. E96001-E99060" } },
                { number: 190, date: { startYear: 1934, startMonth: 3, endYear: 1934, endMonth: 6 }, cert: { startLinear: 599061, endLinear: 602572, label: "Nos. E99061-F02572" } },
                { number: 191, date: { startYear: 1934, startMonth: 6, endYear: 1934, endMonth: 10 }, cert: { startLinear: 602573, endLinear: 605500, label: "Nos. F02573-F05500" } },
                { number: 192, date: { startYear: 1934, startMonth: 10, endYear: 1935, endMonth: 1 }, cert: { startLinear: 605501, endLinear: 608000, label: "Nos. F05501-F08000" } },
                { number: 193, date: { startYear: 1935, startMonth: 1, endYear: 1935, endMonth: 4 }, cert: { startLinear: 608001, endLinear: 611420, label: "Nos. F08001-F11420" } },
                { number: 194, date: { startYear: 1935, startMonth: 4, endYear: 1935, endMonth: 7 }, cert: { startLinear: 611421, endLinear: 614450, label: "Nos. F11421-F14450" } },
                { number: 195, date: { startYear: 1935, startMonth: 7, endYear: 1935, endMonth: 11 }, cert: { startLinear: 614451, endLinear: 617945, label: "Nos. F14451-F17945" } },
                { number: 196, date: { startYear: 1935, startMonth: 11, endYear: 1936, endMonth: 2 }, cert: { startLinear: 617946, endLinear: 621040, label: "Nos. F17946-F21040" } },
                { number: 197, date: { startYear: 1936, startMonth: 2, endYear: 1936, endMonth: 6 }, cert: { startLinear: 621041, endLinear: 624575, label: "Nos. F21041-F24575" } },
                { number: 198, date: { startYear: 1936, startMonth: 6, endYear: 1936, endMonth: 9 }, cert: { startLinear: 624576, endLinear: 627625, label: "Nos. F24576-F27625" } },
                { number: 199, date: { startYear: 1936, startMonth: 9, endYear: 1937, endMonth: 1 }, cert: { startLinear: 627626, endLinear: 630639, label: "Nos. F27626-F30639" } },
                { number: 200, date: { startYear: 1936, startMonth: 12, endYear: 1937, endMonth: 3 }, cert: { startLinear: 630640, endLinear: 633770, label: "Nos. F30640-F33770" } },
                { number: 201, date: { startYear: 1937, startMonth: 3, endYear: 1937, endMonth: 7 }, cert: { startLinear: 633771, endLinear: 637185, label: "Nos. F33771-F37185" } },
                { number: 202, date: { startYear: 1937, startMonth: 7, endYear: 1937, endMonth: 10 }, cert: { startLinear: 637186, endLinear: 640347, label: "Nos. F37186-F40347" } },
                { number: 203, date: { startYear: 1937, startMonth: 10, endYear: 1938, endMonth: 2 }, cert: { startLinear: 640348, endLinear: 643800, label: "Nos. F40348-F43800" } },
                { number: 204, date: { startYear: 1938, startMonth: 2, endYear: 1938, endMonth: 5 }, cert: { startLinear: 643801, endLinear: 646800, label: "Nos. F43801-F46800" } },
                { number: 205, date: { startYear: 1938, startMonth: 5, endYear: 1938, endMonth: 9 }, cert: { startLinear: 646801, endLinear: 650360, label: "Nos. F46801-F50360" } },
                { number: 206, date: { startYear: 1938, startMonth: 9, endYear: 1938, endMonth: 12 }, cert: { startLinear: 650361, endLinear: 653399, label: "Nos. F50361-F53399" } },
                { number: 207, date: { startYear: 1938, startMonth: 12, endYear: 1939, endMonth: 4 }, cert: { startLinear: 653400, endLinear: 656895, label: "Nos. F53400-F56895" } },
                { number: 208, date: { startYear: 1939, startMonth: 4, endYear: 1939, endMonth: 7 }, cert: { startLinear: 656896, endLinear: 659360, label: "Nos. F56896-F59360" } },
                { number: 209, date: { startYear: 1939, startMonth: 7, endYear: 1939, endMonth: 11 }, cert: { startLinear: 659361, endLinear: 662840, label: "Nos. F59361-F62840" } },
                { number: 210, date: { startYear: 1939, startMonth: 11, endYear: 1939, endMonth: 12 }, cert: { startLinear: 662841, endLinear: 664000, label: "Nos. F62841-F64000" } },
                { number: 211, date: { startYear: 1939, startMonth: 12, endYear: 1940, endMonth: 4 }, cert: { startLinear: 664001, endLinear: 667849, label: "Nos. F64001-F67849" } },
                { number: 212, date: { startYear: 1940, startMonth: 4, endYear: 1940, endMonth: 7 }, cert: { startLinear: 667850, endLinear: 670774, label: "Nos. F67850-F70774" } },
                { number: 213, date: { startYear: 1940, startMonth: 7, endYear: 1940, endMonth: 11 }, cert: { startLinear: 670775, endLinear: 674500, label: "Nos. F70775-F74500" } },
                { number: 214, date: { startYear: 1940, startMonth: 11, endYear: 1941, endMonth: 2 }, cert: { startLinear: 674501, endLinear: 677549, label: "Nos. F74501-F77549" } },
                { number: 215, date: { startYear: 1941, startMonth: 2, endYear: 1941, endMonth: 5 }, cert: { startLinear: 677550, endLinear: 681000, label: "Nos. F77550-F81000" } },
                { number: 216, date: { startYear: 1941, startMonth: 5, endYear: 1941, endMonth: 9 }, cert: { startLinear: 681001, endLinear: 684319, label: "Nos. F81001-F84319" } },
                { number: 217, date: { startYear: 1941, startMonth: 9, endYear: 1942, endMonth: 1 }, cert: { startLinear: 684320, endLinear: 687849, label: "Nos. F84320-F87849" } },
                { number: 218, date: { startYear: 1942, startMonth: 1, endYear: 1942, endMonth: 4 }, cert: { startLinear: 687850, endLinear: 691000, label: "Nos. F87850-F91000" } },
                { number: 219, date: { startYear: 1942, startMonth: 4, endYear: 1942, endMonth: 7 }, cert: { startLinear: 691001, endLinear: 694333, label: "Nos. F91001-F94333" } },
                { number: 220, date: { startYear: 1942, startMonth: 7, endYear: 1942, endMonth: 11 }, cert: { startLinear: 694334, endLinear: 697500, label: "Nos. F94334-F97500" } },
                { number: 221, date: { startYear: 1942, startMonth: 11, endYear: 1943, endMonth: 2 }, cert: { startLinear: 697501, endLinear: 700821, label: "Nos. F97501-G00821" } },
                { number: 222, date: { startYear: 1943, startMonth: 2, endYear: 1943, endMonth: 4 }, cert: { startLinear: 700822, endLinear: 703435, label: "Nos. G00822-G03435" } },
                { number: 223, date: { startYear: 1943, startMonth: 4, endYear: 1943, endMonth: 7 }, cert: { startLinear: 703436, endLinear: 706700, label: "Nos. G03436-G06700" } },
                { number: 224, date: { startYear: 1943, startMonth: 7, endYear: 1943, endMonth: 11 }, cert: { startLinear: 706701, endLinear: 710000, label: "Nos. G06701-G10000" } },
                { number: 225, date: { startYear: 1943, startMonth: 11, endYear: 1944, endMonth: 1 }, cert: { startLinear: 710001, endLinear: 713250, label: "Nos. G10001-G13250" } },
                { number: 226, date: { startYear: 1944, startMonth: 1, endYear: 1944, endMonth: 4 }, cert: { startLinear: 713251, endLinear: 716500, label: "Nos. G13251-G16500" } },
                { number: 227, date: { startYear: 1944, startMonth: 4, endYear: 1944, endMonth: 8 }, cert: { startLinear: 716501, endLinear: 719555, label: "Nos. G16501-G19555" } },
                { number: 228, date: { startYear: 1944, startMonth: 8, endYear: 1944, endMonth: 11 }, cert: { startLinear: 719556, endLinear: 722440, label: "Nos. G19556-G22440" } },
                { number: 229, date: { startYear: 1944, startMonth: 11, endYear: 1945, endMonth: 1 }, cert: { startLinear: 722441, endLinear: 724500, label: "Nos. G22441-G24500" } },
                { number: 230, date: { startYear: 1945, startMonth: 1, endYear: 1945, endMonth: 3 }, cert: { startLinear: 724501, endLinear: 726975, label: "Nos. G24501-G26975" } },
                { number: 231, date: { startYear: 1945, startMonth: 3, endYear: 1945, endMonth: 7 }, cert: { startLinear: 726976, endLinear: 730323, label: "Nos. G26976-G30323" } },
                { number: 232, date: { startYear: 1945, startMonth: 7, endYear: 1945, endMonth: 10 }, cert: { startLinear: 730324, endLinear: 733609, label: "Nos. G30324-G33609" } },
                { number: 233, date: { startYear: 1945, startMonth: 10, endYear: 1946, endMonth: 1 }, cert: { startLinear: 733610, endLinear: 736000, label: "Nos. G33610-G36000" } },
                { number: 234, date: { startYear: 1946, startMonth: 1, endYear: 1946, endMonth: 4 }, cert: { startLinear: 736001, endLinear: 739300, label: "Nos. G36001-G39300" } },
                { number: 235, date: { startYear: 1946, startMonth: 4, endYear: 1946, endMonth: 8 }, cert: { startLinear: 739301, endLinear: 742675, label: "Nos. G39301-G42675" } },
                { number: 236, date: { startYear: 1946, startMonth: 8, endYear: 1946, endMonth: 11 }, cert: { startLinear: 742676, endLinear: 746000, label: "Nos. G42676-G46000" } },
                { number: 237, date: { startYear: 1946, startMonth: 11, endYear: 1947, endMonth: 3 }, cert: { startLinear: 746001, endLinear: 749325, label: "Nos. G46001-G49325" } },
                { number: 238, date: { startYear: 1947, startMonth: 3, endYear: 1947, endMonth: 6 }, cert: { startLinear: 749326, endLinear: 752625, label: "Nos. G49326-G52625" } },
                { number: 239, date: { startYear: 1947, startMonth: 6, endYear: 1947, endMonth: 10 }, cert: { startLinear: 752626, endLinear: 755950, label: "Nos. G52626-G55950" } },
                { number: 240, date: { startYear: 1947, startMonth: 10, endYear: 1948, endMonth: 1 }, cert: { startLinear: 755951, endLinear: 759200, label: "Nos. G55951-G59200" } },
                { number: 241, date: { startYear: 1948, startMonth: 1, endYear: 1948, endMonth: 4 }, cert: { startLinear: 759201, endLinear: 762560, label: "Nos. G59201-G62560" } },
                { number: 242, date: { startYear: 1948, startMonth: 4, endYear: 1948, endMonth: 8 }, cert: { startLinear: 762561, endLinear: 765740, label: "Nos. G62561-G65740" } },
                { number: 243, date: { startYear: 1948, startMonth: 8, endYear: 1948, endMonth: 12 }, cert: { startLinear: 765741, endLinear: 769100, label: "Nos. G65741-G69100" } },
                { number: 244, date: null, cert: null },
                { number: 245, date: { startYear: 1948, startMonth: 12, endYear: 1949, endMonth: 3 }, cert: { startLinear: 769101, endLinear: 772450, label: "Nos. G69101-G72450" } },
                { number: 246, date: { startYear: 1949, startMonth: 3, endYear: 1949, endMonth: 6 }, cert: { startLinear: 772451, endLinear: 775210, label: "Nos. G72451-G75210" } },
                { number: 247, date: { startYear: 1949, startMonth: 6, endYear: 1949, endMonth: 9 }, cert: { startLinear: 775211, endLinear: 778100, label: "Nos. G75211-G78100" } },
                { number: 248, date: { startYear: 1949, startMonth: 9, endYear: 1950, endMonth: 1 }, cert: { startLinear: 778101, endLinear: 781474, label: "Nos. G78101-G81474" } }            ];
        }


        canHandle(location, month, year) {

            if (location !== "Baltimore City") {
                return false;
            }

            return this.inDateRange(month, year);
        }


        // File 31 lives directly at the item root, not under a
        // per-file prefix like every other number in this series -
        // that's the only reason this override exists.
        buildArchiveUrl(range, number) {

            if (number === 31) {
                return "https://archive.org/details/" + range.collection;
            }

            return super.buildArchiveUrl(range, number);
        }


        lookupSeries(seriesId) {

            const match = seriesId
                .toUpperCase()
                .match(new RegExp(`^${this.name}-(\\d+)$`));

            if (!match) {
                return [];
            }

            const number = Number(match[1]);
            const unusedNote = this.UNUSED_RECORDS[number];

            if (unusedNote) {
                return [
                    this.createResult({ number, label: unusedNote, url: null })
                ];
            }

            return super.lookupSeries(seriesId);
        }


        /**
         * A record's label leads with its actual date span (e.g.
         * "01/1914-04/1914"), not just the certificate range - a file
         * often covers several months, and seeing only the certificate
         * range on a single-month hit hides that. Combined with
         * lookupYear()'s (series, number) dedup, searching a whole year
         * shows each physical file once, with its real span visible,
         * instead of the same file repeated once per month it covers.
         */
        lookupLocationMonthYear(location, month, year) {

            const value = year * 100 + month;

            const matches = this.DATE_CERT_RECORDS.filter(record => {

                if (!record.date) {
                    return false;
                }

                const start = record.date.startYear * 100 + record.date.startMonth;
                const end = record.date.endYear * 100 + record.date.endMonth;

                return value >= start && value <= end;
            });

            return matches.map(record => {

                const certLabel = record.cert
                    ? record.cert.label
                    : "No distinct certificate range for this unit";

                return this.createResult({
                    location: "Baltimore City",
                    year,
                    month,
                    number: record.number,
                    label: `${formatRecordDateRange(record.date)} ${certLabel}`,
                    url: this.archiveUrl(record.number)
                });
            });
        }


        /**
         * Certificates in this series run in one continuous numbered
         * sequence across the whole series (not per-county or per-year
         * like the other series' record numbers), so a specific
         * certificate number can be looked up directly to find which
         * scanned item it's in - see parseCertificateNumber() above for
         * the input format ("B45678", case-insensitive, no letter for
         * the earliest block).
         *
         * Also computes an approximate deep link to the right page
         * within that item, assuming roughly one certificate per
         * scanned page (based on one known anchor point: the 334th
         * certificate in a given record's range corresponds to that
         * item's page 333). This is a rough estimate, not a precise
         * lookup - if it overshoots the item's actual page count,
         * archive.org's viewer just lands on page 1 instead of
         * breaking, so an imprecise estimate is harmless, just less
         * useful for certificates near the end of a large range.
         */
        lookupCertificateNumber(certificateNumber) {

            const linear = parseCertificateNumber(certificateNumber);

            if (linear === null) {
                return [];
            }

            const record = this.DATE_CERT_RECORDS.find(r =>
                r.cert && linear >= r.cert.startLinear && linear <= r.cert.endLinear
            );

            if (!record) {
                return [];
            }

            const url = this.archiveUrl(record.number);

            if (!url) {
                return [];
            }

            const position = linear - record.cert.startLinear + 1;
            const page = Math.max(1, position - 1);

            return [
                this.createResult({
                    number: record.number,
                    year: record.date ? record.date.startYear : null,
                    month: record.date ? record.date.startMonth : null,
                    label: record.cert.label,
                    certificateNumber: formatCertificateNumber(linear),
                    url,
                    approximatePageUrl: `${url}page/n${page}/mode/1up`
                })
            ];
        }

    }

    const instance = new CM1132Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.CM1132 = instance;

})(typeof window !== "undefined" ? window : globalThis);
