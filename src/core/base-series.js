if (typeof require !== "undefined") {
    require("./namespace.js");
}

(function (global) {
    "use strict";

    /**
     * Base class every record series extends. A "series" is one
     * physical set of scanned files on archive.org (e.g. Maryland
     * State Archives series SE43) covering a range of dates/locations
     * for one record type ("death", "birth", ...).
     *
     * Subclasses are expected to provide:
     *   - this.dateRange = { startYear, startMonth, endYear, endMonth }
     *     in the constructor, and canHandle() using inDateRange() below
     *     - this is what lets listSeries() report an accurate timeline
     *     rather than a separately-maintained copy that could drift out
     *     of sync with what canHandle() actually does.
     *   - canHandle(location, month, year) -> boolean
     *   - ARCHIVE_RANGES (if using the default table-based archiveUrl),
     *     OR override archiveUrl(number) directly
     *   - buildIndex() + lookupLocationMonthYear(location, month, year),
     *     if the series supports location/date search (some only
     *     support direct series-ID lookup for now)
     */
    class BaseSeries {

        constructor(
            name,
            seriesType,
            seriesHome = `http://guide.msa.maryland.gov/pages/series.aspx?action=viewseries&id=${name.toLowerCase()}`
        ) {
            this.name = name;
            this.seriesType = seriesType;
            this.seriesHome = seriesHome;

            // Subclasses set this to { startYear, startMonth, endYear,
            // endMonth } - left null here means "no declared range",
            // which inDateRange() treats as unrestricted.
            this.dateRange = null;

            this._index = null;
        }


        /**
         * Shared date-range check every series' canHandle() should use,
         * built from this.dateRange rather than inline comparisons -
         * the same data listSeries() reads to report a timeline, so the
         * two can't disagree with each other.
         *
         * A dateRange boundary's month can be 0 to mean "just a year,
         * no month precision" - matching how the MSA guide sometimes
         * lists a series' start or end as a bare year rather than a
         * specific month. 0 (or omitted) on startMonth is treated as
         * January (the earliest possible month that year); on endMonth
         * it's treated as December (the latest) - so the whole year is
         * included either way, and this is also what tells the display
         * formatting (see examples/basic-form/app.js) to show just the
         * year instead of a specific month.
         */
        inDateRange(month, year) {

            if (!this.dateRange) {
                return true;
            }

            const { startYear, startMonth, endYear, endMonth } = this.dateRange;

            const value = year * 100 + (month || 1);
            const start = startYear * 100 + (startMonth || 1);
            const end = endYear * 100 + (endMonth || 12);

            return value >= start && value <= end;
        }


        get index() {

            if (this._index === null) {
                this._index = this.buildIndex();
            }

            return this._index;
        }


        buildIndex() {
            return {};
        }


        /**
         * Finds the ARCHIVE_RANGES entry that a given file number falls
         * into. Shared by archiveUrl() below and by any subclass that
         * needs the raw range (e.g. to special-case one entry) without
         * re-implementing the linear scan.
         */
        findArchiveRange(number) {

            if (!this.ARCHIVE_RANGES) {
                return null;
            }

            return this.ARCHIVE_RANGES.find(
                range => number >= range.start && number <= range.end
            ) || null;
        }


        /**
         * Builds the archive.org URL for a file once its range is known.
         * Override this (not archiveUrl) if a series needs to special-case
         * how a URL is built for certain numbers - see CM1132Series for
         * an example of overriding just this piece.
         */
        buildArchiveUrl(range, number) {
            return (
                "https://archive.org/details/" +
                range.collection +
                "/" +
                range.prefix +
                String(number).padStart(range.padding, "0") +
                "/"
            );
        }


        archiveUrl(number) {

            const range = this.findArchiveRange(number);

            if (!range) {
                return null;
            }

            return this.buildArchiveUrl(range, number);
        }


        /**
         * Single entry point used internally by MDRecordSearch.lookup().
         * Most callers should use MDRecordSearch.lookup()/lookupSeries()
         * instead of calling a series instance directly.
         */
        lookup(options) {

            if (options.series) {
                return this.lookupSeries(options.series);
            }

            if (options.certificateNumber) {
                return this.lookupCertificateNumber(options.certificateNumber);
            }

            if (options.location && options.month && options.year) {
                return this.lookupLocationMonthYear(
                    options.location,
                    options.month,
                    options.year
                );
            }

            return [];
        }


        /**
         * A series with no location/date search implemented yet just
         * returns no results here, rather than a placeholder "result"
         * pointing at its MSA guide page - a placeholder that looked
         * like a real hit was actively misleading once results started
         * getting aggregated across multiple months (lookupYear would
         * dedupe 12 identical placeholders down to one and attach an
         * arbitrary month to it). Check listSeries()'s
         * supportsLocationSearch field to know ahead of time whether a
         * series covers this kind of search at all.
         */
        lookupLocationMonthYear(_location, _month, _year) {
            return [];
        }


        /**
         * Only a few series (currently just CM1132) are numbered in a
         * single running sequence where a specific certificate/record
         * number can be looked up directly, independent of location or
         * date. A series with no such numbering just returns no results
         * here. Check listSeries()'s supportsCertificateNumberSearch
         * field to know ahead of time whether a series supports this.
         */
        lookupCertificateNumber(_certificateNumber) {
            return [];
        }


        lookupSeries(seriesId) {

            const match = seriesId
                .toUpperCase()
                .match(new RegExp(`^${this.name}-(\\d+)$`));

            if (!match) {
                return [];
            }

            const number = Number(match[1]);
            const url = this.archiveUrl(number);

            if (!url) {
                return [];
            }

            return [
                this.createResult({ number, url })
            ];
        }


        createResult(fields = {}) {
            return {
                series: this.name,
                seriesType: this.seriesType,
                seriesHome: this.seriesHome,

                location: null,
                year: null,
                month: null,

                number: null,
                label: "",
                url: null,

                // Only set by series that support certificate-number
                // lookup (see lookupCertificateNumber() above) - an
                // approximate deep link into the scanned item, not a
                // precise one. See CM1132's own comments for why it can
                // only ever be approximate.
                certificateNumber: null,
                approximatePageUrl: null,

                ...fields
            };
        }

    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = BaseSeries;
    }

    global.MDRecordSearch.BaseSeries = BaseSeries;

})(typeof window !== "undefined" ? window : globalThis);
