/**
 * Every file in src/ attaches itself to a single global namespace object
 * (`window.MDRecordSearch` in a browser, `globalThis.MDRecordSearch` in Node)
 * instead of creating its own top-level global. This file just makes sure
 * that namespace object exists before anything else touches it.
 *
 * Load this first (src/index.js already does, for you).
 *
 * @namespace MDRecordSearch
 */
(function (global) {
    "use strict";

    global.MDRecordSearch = global.MDRecordSearch || {};
    global.MDRecordSearch.series = global.MDRecordSearch.series || {};

    // Kept in sync with package.json's "version" manually - there's no
    // build step to inject it automatically, since the browser has no
    // access to package.json at all. test/core/version.test.js checks
    // the two match, so a mismatch fails the test suite rather than
    // drifting silently.
    global.MDRecordSearch.VERSION = "1.4.2";

    // Where to report a wrong result (a wrong location, month, or
    // series linked - that's a fixable bug) or a data-correction issue
    // (a specific certificate/record number known to be wrong - see
    // the README's note on accuracy). Not per-series, so it isn't part
    // of listSeries()'s output - the same URL for every series.
    global.MDRecordSearch.REPOSITORY_URL = "https://github.com/bwalsh517/maryland-record-search";
    global.MDRecordSearch.ISSUES_URL = "https://github.com/bwalsh517/maryland-record-search/issues/new?template=data-correction.md";

})(typeof window !== "undefined" ? window : globalThis);
