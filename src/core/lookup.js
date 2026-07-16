if (typeof require !== "undefined") {
    require("./series-registry.js");
    require("./counties.js");
}

(function (global) {
    "use strict";

    const ns = global.MDRecordSearch;

    /**
     * Main entry point for third-party integrations.
     *
     * Four ways to call it:
     *
     *   lookup({ series: "SE45-1037" })
     *     -> direct lookup of a known series/file number, e.g. from a
     *        citation or an existing index someone already has.
     *
     *   lookup({ certificateNumber: "B45678", recordType })
     *     -> direct lookup by a raw certificate number, for the few
     *        series (currently just CM1132) numbered in one continuous
     *        running sequence rather than per-county/per-year. See
     *        lookupCertificate() below.
     *
     *   lookup({ location, month, year, recordType })
     *     -> find which series/file covers a given county (or
     *        "Baltimore City") for a given month/year.
     *
     *   lookup({ location, year, recordType })  (month omitted)
     *     -> find every file covering that county for every month of
     *        that year - equivalent to calling lookupYear() directly.
     *        Useful when you don't know the month, or want to show a
     *        whole year's worth of files at once.
     *
     * `recordType` ("death", and eventually "birth") is optional and
     * only needed once more than one record type is registered - omit
     * it and every registered series is considered, same as today.
     *
     * Always returns an array (possibly empty) and never throws -
     * malformed input (an unrecognized county string, a garbage
     * series ID, etc.) just yields no results. If you want to
     * validate a location string yourself and see *why* it failed,
     * call MDRecordSearch.counties.normalizeCounty() directly - it
     * throws a CountyNotFoundError with detail.
     */
    function lookup(options = {}) {

        try {

            if (options.series) {
                return lookupSeries(options.series);
            }

            if (options.certificateNumber) {
                return lookupCertificate(options.certificateNumber, { recordType: options.recordType });
            }

            if (options.location && options.year && !options.month) {
                return lookupYear(options);
            }

            if (options.location && options.month && options.year) {
                return lookupMonth(options);
            }

            return [];

        } catch {
            return [];
        }
    }


    /**
     * All files covering one county (or "Baltimore City") for one
     * specific month/year. This is what lookup() calls internally when
     * a month is given - exposed separately in case you want it
     * without the branching lookup() does.
     */
    function lookupMonth(options) {

        const { month, year, recordType } = options;

        // Normalized once, up front - this is what decides routing
        // (canHandle()), not the raw input. A numeric county code
        // (e.g. 30 for Baltimore City) or an alias needs to resolve
        // to a real county name before canHandle()'s exact-string
        // checks can match it.
        const location = ns.counties.normalizeCounty(options.location);

        const candidates = ns.SERIES.filter(series =>
            (!recordType || series.seriesType === recordType) &&
            series.canHandle(location, month, year)
        );

        // Normally exactly one series matches a given month. If more
        // than one does, that's surfaced here (all results returned)
        // rather than silently picking the first registered one -
        // which would hide a real data/coverage bug in canHandle().
        return candidates.flatMap(series =>
            series.lookup({ location, month, year })
        );
    }


    /**
     * All files covering one county (or "Baltimore City") across every
     * month of a given year - for when you don't know the month, or
     * want to browse a whole year at once. Correctly spans series
     * transitions mid-year (e.g. SE44 ending and SE45 starting in the
     * same year) since it checks month-by-month rather than assuming
     * one series covers the whole year.
     *
     * Some series file certificates once per *year* rather than per
     * month - the same file covers every month for that county, and a
     * result for one of those files always has month: null (that's
     * what the flag is for). Once a series has answered for a given
     * location/year with only whole-year results, it has nothing left
     * to say for the remaining months, so it's skipped rather than
     * queried again for the rest of the year.
     *
     * That shortcut alone isn't enough for a series where one file
     * spans several months but not necessarily the whole year (e.g.
     * CM1132's certificate books, each covering a few months) - month
     * isn't null there since a different file could start partway
     * through the year, so querying has to continue, but the same file
     * would otherwise show up once per month it covers. A second,
     * explicit dedup by (series, number) catches that case: each
     * distinct file appears exactly once, at the first month it's
     * found, regardless of how many months it actually spans.
     */
    function lookupYear(options) {

        const { year, recordType } = options;

        try {

            const location = ns.counties.normalizeCounty(options.location);

            const results = [];
            const satisfiedForYear = new Set();
            const seenRecords = new Set();

            for (let month = 1; month <= 12; month++) {

                const candidates = ns.SERIES.filter(series =>
                    !satisfiedForYear.has(series.name) &&
                    (!recordType || series.seriesType === recordType) &&
                    series.canHandle(location, month, year)
                );

                for (const series of candidates) {

                    const seriesResults = series.lookup({ location, month, year });

                    if (seriesResults.length === 0) {
                        continue;
                    }

                    for (const result of seriesResults) {

                        const key = `${result.series}|${result.number}`;

                        if (seenRecords.has(key)) {
                            continue;
                        }

                        seenRecords.add(key);
                        results.push(result);
                    }

                    if (seriesResults.every(r => r.month === null)) {
                        satisfiedForYear.add(series.name);
                    }
                }
            }

            return results;

        } catch {
            return [];
        }
    }


    /**
     * Direct lookup by a raw certificate/record number, for series
     * numbered in one continuous running sequence rather than
     * per-county/per-date (currently just CM1132's Baltimore City
     * death certificates, e.g. "B45678"). Most series don't support
     * this at all - see listSeries()'s supportsCertificateNumberSearch
     * field to check ahead of time.
     */
    function lookupCertificate(certificateNumber, options = {}) {

        const { recordType } = options;

        try {

            const candidates = ns.SERIES.filter(series =>
                (!recordType || series.seriesType === recordType) &&
                series.lookupCertificateNumber !== ns.BaseSeries.prototype.lookupCertificateNumber
            );

            return candidates.flatMap(series =>
                series.lookupCertificateNumber(certificateNumber)
            );

        } catch {
            return [];
        }
    }


    /**
     * Looks up a single series/file directly, e.g. "SE45-1037".
     * Matches the series name exactly (everything before the last
     * "-"), not by prefix - so a malformed ID can't be misattributed
     * to an unrelated series just because their names share a prefix.
     */
    function lookupSeries(seriesId) {

        const id = String(seriesId || "").trim().toUpperCase();
        const dashIndex = id.lastIndexOf("-");

        if (dashIndex === -1) {
            return [];
        }

        const name = id.slice(0, dashIndex);
        const series = ns.SERIES.find(s => s.name === name);

        if (!series) {
            return [];
        }

        try {
            return series.lookup({ series: id });
        } catch {
            return [];
        }
    }


    /**
     * Introspection helper for integrators: what series are
     * registered, what record type and date range each covers, and
     * whether location/date search is actually implemented for it
     * yet (vs. series-ID-only lookup). `seriesIdRange` is the series'
     * own SE43-N-style numbering, separate from `dateRange` (a date)
     * and `certificateSearchRange` (a different numbering space for
     * the few series with certificate numbers) - useful for telling
     * "that number doesn't exist" apart from "that number exists but
     * isn't covered by whatever search was attempted" when a lookup
     * comes back empty. `dateRange` is the exact same
     * data each series' canHandle() uses (via inDateRange()) - not a
     * separately-maintained copy, so it can't disagree with actual
     * search behavior.
     */
    function listSeries() {
        return ns.SERIES.map(series => {

            const supportsCertificateNumberSearch =
                series.lookupCertificateNumber !== ns.BaseSeries.prototype.lookupCertificateNumber;

            return {
                name: series.name,
                recordType: series.seriesType,
                seriesHome: series.seriesHome,
                dateRange: series.dateRange,
                seriesIdRange: series.seriesIdRange || null,
                supportsLocationSearch:
                    series.lookupLocationMonthYear !== ns.BaseSeries.prototype.lookupLocationMonthYear,
                supportsCertificateNumberSearch,
                // Assumed to match the series' full dateRange unless a
                // series explicitly sets its own certificateSearchRange
                // (see SE46, where certificate search only covers part
                // of the series) - most series that support certificate
                // search at all cover their whole span, so this keeps
                // "implemented" meaning "implemented", not "implemented
                // for some unstated portion" by default.
                certificateSearchRange: supportsCertificateNumberSearch
                    ? (series.certificateSearchRange || series.dateRange)
                    : null
            };
        });
    }


    ns.lookup = lookup;
    ns.lookupYear = lookupYear;
    ns.lookupSeries = lookupSeries;
    ns.lookupCertificate = lookupCertificate;
    ns.listSeries = listSeries;

    const api = { lookup, lookupYear, lookupSeries, lookupCertificate, listSeries };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

})(typeof window !== "undefined" ? window : globalThis);
