/**
 * Node/bundler entry point.
 *
 *   const { lookup, lookupSeries, listSeries } = require("md-record-search");
 *
 *   lookup({ location: "Anne Arundel", month: 5, year: 1910 });
 *   // -> [{ series: "SE43", number: 1, url: "https://archive.org/...", ... }]
 *
 * In a browser without a bundler, include the files under src/core and
 * src/series directly via <script> tags in the order shown in
 * examples/basic-form/index.html - everything attaches to a single
 * window.MDRecordSearch namespace, so no build step is required.
 */

"use strict";

require("./core/lookup.js");

const global = typeof window !== "undefined" ? window : globalThis;
const ns = global.MDRecordSearch;

module.exports = {
    lookup: ns.lookup,
    lookupYear: ns.lookupYear,
    lookupSeries: ns.lookupSeries,
    lookupCertificate: ns.lookupCertificate,
    listSeries: ns.listSeries,
    counties: ns.counties,
    BaseSeries: ns.BaseSeries,
    SERIES: ns.SERIES,
    VERSION: ns.VERSION,
    REPOSITORY_URL: ns.REPOSITORY_URL,
    ISSUES_URL: ns.ISSUES_URL
};
