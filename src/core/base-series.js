if (typeof require !== "undefined") {
    require("./namespace.js");
}

(function (global) {
    "use strict";

    /**
     * The object every lookup function in this library returns, one
     * per matching file/certificate. See BaseSeries#createResult,
     * which is what actually builds one - every field listed here is
     * always present, even when null.
     *
     * @typedef {object} LookupResult
     * @property {string} series - Series name, e.g. "SE45".
     * @property {string} seriesType - "death" or "birth".
     * @property {string} seriesHome - URL of the series' MSA guide page.
     * @property {?string} location
     * @property {?number} year
     * @property {?number} month - 1-12, or null for a whole-year/no-month-dimension record.
     * @property {?number} number - File number within this series.
     * @property {string} label - Extra detail beyond location/number, empty when there's nothing extra.
     * @property {?string} url - A scan or MSA guide URL, or null if none is known.
     * @property {?string} msaGuideUrl - MSA's own details page for this number, independent of `url`.
     * @property {?number} part - Distinguishes a multipart record's spans from each other; null otherwise.
     * @property {number} sortWeight - 0 for an ordinary result; higher sorts after ordinary results.
     * @property {?string} certificateNumber - Set only for certificate-number lookups.
     * @property {?string} approximatePageUrl - An approximate deep link, set only where computed.
     */

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
     *     OR override archiveUrl(number) directly - a series needs
     *     neither if it has nothing better than the default MSA guide
     *     fallback to offer (see archiveUrl() below)
     *   - buildIndex() + lookupLocationMonthYear(location, month, year),
     *     if the series supports location/date search (some only
     *     support direct series-ID lookup for now)
     */
    class BaseSeries {

        /**
         * @param {string} name - Series identifier, e.g. "SE45". Used as the prefix
         * for every file ID in this series ("SE45-1037") and as the registry key.
         * @param {string} seriesType - Record type, e.g. "death" or "birth".
         * @param {string} [seriesHome] - URL of the series' own MSA guide page.
         * Defaults to the standard MSA series-view URL built from `name`.
         */
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
         *
         * @param {number} month - 1-12.
         * @param {number} year
         * @returns {boolean}
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
         *
         * @param {number} number - File number within this series.
         * @returns {?object} The matching ARCHIVE_RANGES entry, or null if none matches
         * or this series has no ARCHIVE_RANGES table at all.
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
         *
         * @param {object} range - An ARCHIVE_RANGES entry, as returned by findArchiveRange().
         * @param {number} number - File number within this series.
         * @returns {string} The archive.org details URL for this file.
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


        /**
         * Every MSA-confirmed series number has a details page at this
         * URL, whether or not a real scan exists there (MSA still shows
         * a page saying so). Shared by archiveUrl()'s default fallback
         * below and by any series that needs to build one directly
         * (SE43's confirmed-missing-scan gap, SE46's 2013-2014 tail,
         * etc.) instead of duplicating the template.
         *
         * @param {number} number - File number within this series.
         * @returns {string} The MSA guide details-page URL for this file.
         */
        msaItemUrl(number) {
            return `https://guide.msa.maryland.gov/pages/item.aspx?ID=${this.name}-${number}`;
        }


        /**
         * Falls back to the MSA guide page once nothing more specific
         * (ARCHIVE_RANGES, or a subclass's own override) has an answer -
         * seriesIdRange is sourced directly from MSA's own numbering, so
         * every number inside it has a real details page there, even if
         * this library has no scan link for it yet. A subclass only
         * needs to write code here when it has something better than
         * the MSA page to offer for part of its range; everything else
         * is free.
         *
         * @param {number} number - File number within this series.
         * @returns {?string} A scan or MSA guide URL, or null if this number has no known page at all.
         */
        archiveUrl(number) {

            const range = this.findArchiveRange(number);

            if (range) {
                return this.buildArchiveUrl(range, number);
            }

            if (this.seriesIdRange &&
                number >= this.seriesIdRange.start && number <= this.seriesIdRange.end) {
                return this.msaItemUrl(number);
            }

            return null;
        }


        /**
         * Single entry point used internally by MDRecordSearch.lookup().
         * Most callers should use MDRecordSearch.lookup()/lookupSeries()
         * instead of calling a series instance directly.
         *
         * @param {LookupOptions} options
         * @returns {Array.<LookupResult>} Matching results for this series, possibly empty.
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
         *
         * Subclasses that support location/date search override this.
         *
         * @param {string} _location - Normalized county name (or "Baltimore City").
         * @param {number} _month - 1-12.
         * @param {number} _year
         * @returns {Array.<LookupResult>} Matching results, possibly empty.
         */
        lookupLocationMonthYear(_location, _month, _year) {
            return [];
        }


        /**
         * The part of certificate-query parsing that's identical
         * across every series that has one: an optional "YYYY-" year
         * prefix, and the legacy "LETTER-NUMBER" dash style (e.g.
         * "A-1234", kept for backward compatibility with CM1132's
         * original input format - harmless for a series with no
         * letters at all, since the dash just won't match anything and
         * passes through untouched). What a subclass does with the
         * remainder is not shared: whether the year is required or
         * optional, whether it's a plain number or has its own letter
         * scheme, is all series-specific and stays in each series'
         * own lookupCertificateNumber().
         *
         * @param {string} input - Raw certificate query, e.g. "1995-1234" or "A-1234".
         * @returns {{year: ?number, rest: string}}
         */
        splitCertificateQuery(input) {

            let raw = String(input || "").trim().toUpperCase();
            let year = null;

            const yearMatch = raw.match(/^(\d{4})-(.+)$/);

            if (yearMatch) {
                year = Number(yearMatch[1]);
                raw = yearMatch[2];
            }

            raw = raw.replace(/^([A-Z])-/, "$1");   // "A-1234" -> "A1234"

            return { year, rest: raw };
        }


        /**
         * Only some series (currently CM1132, CM1135, SE46, CE502) are
         * numbered in a way that a specific certificate/record number
         * can be looked up directly, independent of location or date -
         * see splitCertificateQuery() above for the shared part of
         * parsing one. A series with no such numbering just returns no
         * results here. Check listSeries()'s
         * supportsCertificateNumberSearch field to know ahead of time
         * whether a series supports this.
         *
         * Subclasses that support certificate-number search override this.
         *
         * @param {string} _certificateNumber - Raw certificate/record number.
         * @returns {Array.<LookupResult>} Matching results, possibly empty.
         */
        lookupCertificateNumber(_certificateNumber) {
            return [];
        }


        /**
         * Direct lookup by this series' own file ID, e.g. "SE45-1037".
         *
         * @param {string} seriesId - Full series/file ID, matched against `this.name`.
         * @returns {Array.<LookupResult>} A single-element array if the ID resolves, otherwise empty.
         */
        lookupSeries(seriesId) {

            const match = seriesId
                .toUpperCase()
                .match(new RegExp(`^${this.name}-(\\d+)$`));

            if (!match) {
                return [];
            }

            const number = Number(match[1]);

            // Numbers outside [start, end] don't exist. A number inside
            // the range but not otherwise handled (a series that
            // doesn't have this record, an unimplemented range) still
            // falls through to archiveUrl() below and returns [] there -
            // this check exists just to catch numbers that were never
            // valid in the first place, which some archiveUrl()
            // overrides (SE44, S1963) don't reject on their own since
            // they compute a URL from a formula rather than looking one
            // up in a table.
            if (this.seriesIdRange &&
                (number < this.seriesIdRange.start || number > this.seriesIdRange.end)) {
                return [];
            }

            const url = this.archiveUrl(number);

            if (!url) {
                return [];
            }

            return [
                this.createResult({ number, url })
            ];
        }


        /**
         * Builds one result object. Every field in the shape below is
         * always present, even when null, so callers never need to
         * guess whether a key is missing versus not applicable. See
         * the LookupResult typedef above for the full field list.
         *
         * @param {object} [fields] - Overrides for any of the default fields below.
         * @returns {LookupResult}
         */
        createResult(fields = {}) {

            const number = fields.number ?? null;

            // Always the MSA details page for this number, regardless of
            // what url ends up being (a real scan, an MSA link too, or
            // null for a confirmed no-file record) - a separate, always-
            // present pointer to "MSA's own page for this", useful even
            // when a scan link is also present since MSA may document
            // things this library doesn't.
            const msaGuideUrl = (number !== null && this.seriesIdRange &&
                number >= this.seriesIdRange.start && number <= this.seriesIdRange.end)
                ? this.msaItemUrl(number)
                : null;

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
                msaGuideUrl,

                // null for every series except a genuine multipart record
                // (a single physical record with more than one distinct,
                // non-contiguous date span - currently just CM1135-113).
                // Distinguishes that record's two results from each other
                // so lookupYear()'s dedup keys on (series, number, part)
                // instead of collapsing them into one.
                part: null,

                // 0 for every series except a deliberately lower-confidence
                // result (currently just CM1135's lost-number sets - see
                // its lookupLocationMonthYear()). lookupMonth(), lookupYear()
                // and lookupCertificate() stable-sort by this before
                // returning, so a higher value always sorts after every
                // ordinary result - regardless of which month a year
                // search happens to discover it in, which plain discovery
                // order can't guarantee on its own.
                sortWeight: 0,

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
